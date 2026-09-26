import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const isProduction = process.env.NODE_ENV === 'production';
  // AI Studio requires the dev server to run on port 3000
  const port = 3000;

  app.use(express.json());

  // Initialize Gemini SDK with API key from environment
  const ai = new GoogleGenAI();

  // REST API endpoint for quick assistant queries & text guidance
  app.post('/api/assistant/query', async (req, res) => {
    try {
      const { prompt, contextData } = req.body;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt || 'Hola, ¿puedes darme un resumen de orientación del Barrio Terminales?',
        config: {
          systemInstruction: `Eres "Luz Guía - Asistente de Audio y Accesibilidad" para personas ciegas y con baja visión en el Barrio Terminales y Estación Central de Santiago de Chile.
Tu rol es brindar guía espacial, sonora y de movilidad paso a paso con máxima claridad y empatía:
1. Orientación sonora y podotáctil: Describe cómo guiarse por texturas podotáctiles en veredas, sonidos de torniquetes, megafonía de andenes y cruces con semáforos sonoros de la UOCT.
2. Estado de viajes: Informa sobre andenes, horarios y tiempos de llegada (ETA) de buses (Terminal Sur, Alameda, San Borja) y trenes EFE (Nos Express y Melipilla).
3. Cruces y semáforos: Explica el estado de semáforos en Alameda, Ruiz Tagle, 5 de Abril y Jotabeche, y cuándo es seguro cruzar.
4. Prevención de obstáculos: Informa si hay obras viales o comercio en calzadas identificados en la plataforma STOP de Carabineros.
5. Formato: Habla con voz serena, frases directas, fáciles de entender cuando se leen por sintetizador de voz (TTS). Sé conciso y prioriza la seguridad física de la persona.

Contexto operativo actual del cuadrante:
${JSON.stringify(contextData || {})}`
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error('Error generating audio guidance:', err);
      res.status(500).json({ error: err?.message || 'Error en el servicio de asistencia' });
    }
  });

  // WebSocket Server for Gemini 3.8 Live API real-time voice streaming
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    if (url.pathname === '/live' || url.pathname === '/api/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[Gemini Live API] Client connected via WebSocket');
    let session: any = null;

    try {
      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Aoede' } // Clear, friendly natural voice
            }
          },
          systemInstruction: `Eres "Luz Guía", el asistente de voz y navegación para personas ciegas en el Barrio Terminales de Santiago de Chile (Terminal Alameda, Terminal Sur, Terminal San Borja y Estación Central EFE Trenes).
Proporciona instrucciones orales concisas y claras sobre andenes, horarios de salida, rutas peatonales con pavimento podotáctil y estado de semáforos coordinados con la UOCT.`
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const textData = message.serverContent?.modelTurn?.parts?.[0]?.text;
            if (audioData && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'audio', audio: audioData, text: textData }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'session_closed' }));
            }
          },
          onerror: (err) => {
            console.error('[Gemini Live Error]:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'error', error: String(err) }));
            }
          }
        }
      });

      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({
          type: 'ready',
          message: 'Asistente de audio conectado a Gemini 3.8 Live API'
        }));
      }

      clientWs.on('message', (data) => {
        try {
          const payload = JSON.parse(data.toString());
          if (payload.audio && session) {
            session.sendRealtimeInput({
              audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' }
            });
          } else if (payload.text && session) {
            session.sendRealtimeInput({
              text: payload.text
            });
          }
        } catch (parseErr) {
          console.error('Error handling WebSocket message:', parseErr);
        }
      });

      clientWs.on('close', () => {
        try {
          session?.close?.();
        } catch (e) {
          // ignore
        }
      });
    } catch (err: any) {
      console.error('Failed to initialize Gemini Live session:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({
          type: 'error',
          error: err?.message || 'Error al conectar con Gemini 3.8 Live API'
        }));
      }
    }
  });

  // Setup Vite middlewares in development or static serve in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`[Transit App Server] Running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
