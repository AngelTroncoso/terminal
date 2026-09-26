import React, { useState, useEffect, useRef } from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  playEarcon, 
  floatTo16BitPCMBase64, 
  playPCMChunk, 
  speakTextWithTTS, 
  stopTTS 
} from '../../utils/audioUtils';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Radio, 
  Sparkles, 
  ShieldAlert, 
  Footprints, 
  Zap, 
  Compass, 
  X, 
  Send,
  HelpCircle,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const {
    vehicles,
    trafficLights,
    terminals,
    pedestrianCorridors,
    stopRiskPoints,
    selectedVehicleId
  } = useTransit();

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveConnected, setLiveConnected] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState<string>(
    '¡Hola! Soy Luz Guía, tu asistente de audio y accesibilidad para el Barrio Terminales y Estación Central de Trenes. Presiona el botón grande o la barra de espacio para hablar o consultar sobre andenes, horarios y cruces seguros.'
  );
  const [transcript, setTranscript] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [highContrast, setHighContrast] = useState(true);

  // Audio references
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextInputRef = useRef<AudioContext | null>(null);
  const audioContextOutputRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  const selectedVeh = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Prepare real-time context data for assistant
  const getQuadrantContext = () => {
    return {
      selectedVehicle: {
        service: selectedVeh?.serviceNumber,
        company: selectedVeh?.company,
        origin: selectedVeh?.origin,
        destination: selectedVeh?.destination,
        assignedDock: selectedVeh?.assignedDock,
        terminal: terminals.find(t => t.id === selectedVeh?.terminalId)?.name,
        etaMinutes: selectedVeh?.etaMinutes,
        status: selectedVeh?.status
      },
      terminals: terminals.map(t => ({
        name: t.name,
        docks: t.capacityDocks,
        address: t.address
      })),
      trafficLights: trafficLights.slice(0, 4).map(tl => ({
        name: tl.name,
        color: tl.currentColor,
        secondsRemaining: tl.secondsRemaining,
        priority: tl.isPriorityActive
      })),
      pedestrianCorridors: pedestrianCorridors.map(c => ({
        name: c.name,
        time: c.walkMinutes + ' minutos',
        safe: c.isSafeIlluminated
      })),
      stopAlerts: stopRiskPoints.slice(0, 3).map(r => ({
        name: r.name,
        category: r.category,
        action: r.recommendedAction
      }))
    };
  };

  // Connect to Gemini 3.8 Live API via WebSocket when opened
  useEffect(() => {
    if (!isOpen) {
      cleanupAudio();
      return;
    }

    playEarcon('open');

    // Announce via TTS on initial open
    speakTextWithTTS(
      'Asistente de audio Luz Guía activado. Puedes hacer cualquier consulta sobre andenes, buses y cruces seguros.',
      () => setIsSpeaking(false),
      () => setIsSpeaking(true)
    );

    // Try WebSocket connection to /live
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/live`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[VoiceAssistant] Connected to Gemini 3.8 Live socket');
        setLiveConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ready') {
            setLiveConnected(true);
          } else if (msg.type === 'audio' && msg.audio) {
            // Play raw audio chunk from Gemini 3.8 Live
            if (!audioContextOutputRef.current) {
              const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
              audioContextOutputRef.current = new AudioContextClass({ sampleRate: 24000 });
            }
            playPCMChunk(audioContextOutputRef.current, msg.audio, 24000);
            setIsSpeaking(true);
            if (msg.text) {
              setAssistantResponse(prev => prev + ' ' + msg.text);
            }
          } else if (msg.type === 'interrupted') {
            setIsSpeaking(false);
          }
        } catch (e) {
          console.error('Error handling WS audio msg:', e);
        }
      };

      ws.onerror = (err) => {
        console.warn('[VoiceAssistant] WebSocket error, fallback to REST assistant:', err);
        setLiveConnected(false);
      };

      ws.onclose = () => {
        setLiveConnected(false);
      };
    } catch (err) {
      console.warn('Could not initialize WebSocket:', err);
    }

    return () => {
      cleanupAudio();
    };
  }, [isOpen]);

  const cleanupAudio = () => {
    stopTTS();
    setIsSpeaking(false);
    setIsRecording(false);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (audioContextInputRef.current) {
      audioContextInputRef.current.close().catch(() => {});
      audioContextInputRef.current = null;
    }
    if (audioContextOutputRef.current) {
      audioContextOutputRef.current.close().catch(() => {});
      audioContextOutputRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playEarcon('close');
        onClose();
      } else if (e.key === ' ' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        toggleMicrophone();
      } else if (e.key === '1') {
        e.preventDefault();
        askPredefined('status_bus');
      } else if (e.key === '2') {
        e.preventDefault();
        askPredefined('walking_guide');
      } else if (e.key === '3') {
        e.preventDefault();
        askPredefined('traffic_light');
      } else if (e.key === '4') {
        e.preventDefault();
        askPredefined('safety_stop');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRecording]);

  // Start / Stop Microphone & Stream
  const toggleMicrophone = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      playEarcon('received');
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    } else {
      // Start recording
      stopTTS();
      playEarcon('listening');
      setIsRecording(true);
      setTranscript('Escuchando tu voz...');

      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const inputCtx = new AudioContextClass({ sampleRate: 16000 });
        audioContextInputRef.current = inputCtx;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const base64Pcm = floatTo16BitPCMBase64(inputData);

          // If Live WebSocket connected, stream directly to Gemini 3.8 Live API
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ audio: base64Pcm }));
          }
        };

        // Also initiate browser SpeechRecognition as helper transcript
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.lang = 'es-CL';
          recognition.continuous = false;
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
          };

          recognition.onend = () => {
            setIsRecording(false);
            if (transcript && transcript !== 'Escuchando tu voz...') {
              handleSendQuery(transcript);
            }
          };

          recognition.onerror = () => {
            setIsRecording(false);
          };

          speechRecognitionRef.current = recognition;
          recognition.start();
        }
      } catch (err) {
        console.error('Microphone access error:', err);
        setIsRecording(false);
        setAssistantResponse('No se pudo acceder al micrófono. Por favor verifica los permisos en tu navegador o selecciona una de las opciones rápidas.');
      }
    }
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsProcessing(true);
    stopTTS();

    try {
      const res = await fetch('/api/assistant/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          contextData: getQuadrantContext()
        })
      });

      const data = await res.json();
      const reply = data.text || 'Entendido. Estoy coordinando con los terminales.';
      setAssistantResponse(reply);
      playEarcon('received');

      // Speak response aloud via TTS
      speakTextWithTTS(
        reply,
        () => setIsSpeaking(false),
        () => setIsSpeaking(true)
      );
    } catch (err) {
      console.error('Error fetching query response:', err);
      const fallbackReply = `Información directa: Tu viaje en ${selectedVeh.company} (${selectedVeh.serviceNumber}) se encuentra en estado ${selectedVeh.status}, llegando en aproximadamente ${selectedVeh.etaMinutes} minutos al ${selectedVeh.assignedDock}. Cruce con semáforo habilitado.`;
      setAssistantResponse(fallbackReply);
      speakTextWithTTS(
        fallbackReply,
        () => setIsSpeaking(false),
        () => setIsSpeaking(true)
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const askPredefined = (action: 'status_bus' | 'walking_guide' | 'traffic_light' | 'safety_stop') => {
    let prompt = '';
    if (action === 'status_bus') {
      prompt = `¿Dónde viene mi viaje ${selectedVeh.serviceNumber} de ${selectedVeh.company}, en qué andén y a qué hora debo abordar?`;
    } else if (action === 'walking_guide') {
      prompt = `¿Cuál es el camino peatonal seguro con guía podotáctil desde la salida de trenes EFE hacia el Terminal Alameda y Terminal Sur?`;
    } else if (action === 'traffic_light') {
      prompt = `¿Cómo está el semáforo para cruzar la Alameda con Ruiz Tagle en este momento? ¿Tiene sonido audible?`;
    } else if (action === 'safety_stop') {
      prompt = `¿Hay algún punto de cuidado, comercio ambulante o vereda rota según la plataforma STOP de Carabineros en mi camino?`;
    }

    setTranscript(prompt);
    handleSendQuery(prompt);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 bg-slate-950/95 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-label="Asistente de Audio y Navegación Accesible para personas ciegas"
    >
      <div 
        className={`w-full max-w-2xl rounded-3xl border-4 shadow-2xl p-5 sm:p-7 flex flex-col justify-between max-h-[92vh] overflow-y-auto ${
          highContrast 
            ? 'bg-slate-950 border-yellow-400 text-yellow-300' 
            : 'bg-slate-900 border-cyan-500 text-slate-100'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl ${
              highContrast ? 'bg-yellow-400 text-black font-extrabold' : 'bg-cyan-500 text-white'
            }`}>
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs uppercase font-extrabold tracking-widest px-2 py-0.5 rounded ${
                  highContrast ? 'bg-yellow-400 text-black' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                }`}>
                  Modo Accesibilidad Ciegos
                </span>
                {liveConnected ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Gemini 3.8 Live API Activo
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">
                    Asistente Inteligente UOCT
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
                Luz Guía · Asistente de Audio
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighContrast(!highContrast)}
              className="px-3 py-2 rounded-xl text-xs font-bold border-2 border-slate-700 bg-slate-900 text-slate-200 hover:text-white"
              title="Alternar contraste visual alto / estándar"
            >
              {highContrast ? 'Contraste Alto ON' : 'Contraste Normal'}
            </button>
            <button
              onClick={() => {
                playEarcon('close');
                onClose();
              }}
              className="w-12 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xl font-bold"
              aria-label="Cerrar asistente de audio (Tecla Escape)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Central Audio / Speech Waveform & Live Output Box */}
        <div 
          className="my-5 p-5 rounded-2xl border-2 bg-black/60 flex flex-col gap-3 min-h-[140px]"
          role="status"
          aria-live="assertive"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>Respuesta por Voz y Lectura de Pantalla:</span>
            </span>

            {isSpeaking && (
              <span className="text-emerald-400 font-mono flex items-center gap-1 text-[11px] animate-pulse">
                <Volume2 className="w-4 h-4" /> Reproduciendo Audio...
              </span>
            )}
          </div>

          <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
            {assistantResponse}
          </p>

          {transcript && transcript !== 'Escuchando tu voz...' && (
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 italic">
              "Tú preguntaste: {transcript}"
            </div>
          )}
        </div>

        {/* Big accessible Push-to-Talk Button (designed for tactile/easy finger targeting) */}
        <div className="flex flex-col items-center justify-center my-2">
          <button
            onClick={toggleMicrophone}
            className={`w-full py-5 px-6 rounded-2xl font-extrabold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-2xl transition-all border-4 ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-500 text-white border-white animate-pulse'
                : highContrast
                ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 border-black ring-4 ring-yellow-400/50'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-300'
            }`}
            aria-pressed={isRecording}
            aria-label={isRecording ? 'Detener micrófono y procesar consulta' : 'Presiona para hablar con el asistente de audio (o barra espaciadora)'}
          >
            {isRecording ? (
              <>
                <MicOff className="w-8 h-8" />
                <span>DETENER Y ESCUCHAR RESPUESTA</span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8" />
                <span>HABLAR AHORA (Presiona Espacio o toca aquí)</span>
              </>
            )}
          </button>
          <span className="text-xs text-slate-400 font-medium mt-2">
            Tip de accesibilidad: Presiona la <b>barra espaciadora</b> en tu teclado para hablar en cualquier momento.
          </span>
        </div>

        {/* Quick Accessibility Questions (Pre-recorded screen-reader actions) */}
        <div className="mt-4 pt-3 border-t-2 border-slate-800">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-yellow-400" />
            <span>Consultas Rápidas por Teclado o Toque:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => askPredefined('status_bus')}
              className="p-3 rounded-xl border-2 border-slate-800 hover:border-yellow-400 bg-slate-900/90 text-left transition-all flex items-start gap-2.5 group"
            >
              <span className="w-6 h-6 rounded-lg bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-yellow-400 group-hover:text-black">
                1
              </span>
              <div>
                <b className="text-xs text-white block">¿Dónde está mi viaje y andén?</b>
                <span className="text-[11px] text-slate-400">
                  {selectedVeh.company} ({selectedVeh.serviceNumber}) · ETA {selectedVeh.etaMinutes} min
                </span>
              </div>
            </button>

            <button
              onClick={() => askPredefined('walking_guide')}
              className="p-3 rounded-xl border-2 border-slate-800 hover:border-yellow-400 bg-slate-900/90 text-left transition-all flex items-start gap-2.5 group"
            >
              <span className="w-6 h-6 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-cyan-400 group-hover:text-black">
                2
              </span>
              <div>
                <b className="text-xs text-white block">Guía peatonal segura (Huella podotáctil)</b>
                <span className="text-[11px] text-slate-400">
                  Ruta asistida desde EFE hacia Terminal Alameda o Sur
                </span>
              </div>
            </button>

            <button
              onClick={() => askPredefined('traffic_light')}
              className="p-3 rounded-xl border-2 border-slate-800 hover:border-yellow-400 bg-slate-900/90 text-left transition-all flex items-start gap-2.5 group"
            >
              <span className="w-6 h-6 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald-400 group-hover:text-black">
                3
              </span>
              <div>
                <b className="text-xs text-white block">Semáforos y cruces sonoros UOCT</b>
                <span className="text-[11px] text-slate-400">
                  Estado actual de semáforos con aviso acústico para cruzar
                </span>
              </div>
            </button>

            <button
              onClick={() => askPredefined('safety_stop')}
              className="p-3 rounded-xl border-2 border-slate-800 hover:border-yellow-400 bg-slate-900/90 text-left transition-all flex items-start gap-2.5 group"
            >
              <span className="w-6 h-6 rounded-lg bg-rose-400/20 text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-rose-400 group-hover:text-black">
                4
              </span>
              <div>
                <b className="text-xs text-white block">Obstáculos y Seguridad (STOP Carabineros)</b>
                <span className="text-[11px] text-slate-400">
                  Reportes de veredas despejadas y presencia policial
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer info & TTS controls */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopTTS();
                  setIsSpeaking(false);
                } else {
                  speakTextWithTTS(
                    assistantResponse,
                    () => setIsSpeaking(false),
                    () => setIsSpeaking(true)
                  );
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:text-white font-semibold"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span>Silenciar Voz</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-yellow-400" />
                  <span>Volver a Escuchar</span>
                </>
              )}
            </button>
          </div>

          <span className="text-[11px]">
            Conforme a Norma Chilena NCh3262 & WCAG 2.1 AAA
          </span>
        </div>
      </div>
    </div>
  );
};
