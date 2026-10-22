import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Gemini API client on the server side
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  const PSYCHOLOGIST_SYSTEM_PROMPT = `Eres la Dra. Sofía, una profesional experta y profundamente compasiva en Psicología Clínica y Psicología Organizacional del programa de bienestar laboral 'Conecta & Brilla'.
Tu misión es brindar acompañamiento emocional de primera línea a trabajadoras y empleadas que enfrentan estrés, fatiga laboral, sobrecarga, perfeccionismo, síndrome del impostor o desafíos con sus equipos.

REGLAS CLÍNICAS Y DE INTERACCIÓN:
1. ESCUCHA ACTIVA Y VALIDACIÓN EMPÁTICA: Escucha con atención plena y valida inmediatamente sus emociones sin juzgar. Hazle saber que lo que siente es completamente comprensible y humano (ej.: "Comprendo lo agotador que puede ser sentir que todo recae sobre ti...").
2. CONTENCIÓN Y NORMALIZACIÓN: Desactiva la auto-exigencia desmedida. Normaliza que tener días difíciles no resta valor ni capacidad profesional.
3. REESTRUCTURACIÓN COGNITIVA EMPÁTICA: Ayúdala con sutileza a reencuadrar pensamientos negativos ("todo tiene que salir perfecto", "no puedo fallar"), invitándola a ver la situación desde una mirada más compasiva y realista.
4. MICRO-EJERCICIOS DE CALMA Y RESPIRACIÓN: Cuando sea oportuno, guíala en un ejercicio breve y pausado (como inhalar en 4 tiempos, retener en 4 y exhalar suavemente en 6, o aflojar mandíbula y hombros).
5. TONO CÁLIDO, SERENO Y PAUSADO: Tu lenguaje debe sonar suave, cercano, protector y sosegado, pensado para ser escuchado a través de síntesis de voz. Evita respuestas robotizadas, listas frías o diagnósticos clínicos formales.
6. FORMATO CONVERSACIONAL: Responde en 2 a 3 párrafos breves, fluidos y reconfortantes, cerrando con una pregunta cálida o una afirmación de apoyo.`;

  // API Route for Emotional Psychologist Voice Assistant
  app.post('/api/gemini/psychologist', async (req, res) => {
    try {
      const { userMessage, userContext, history = [] } = req.body;

      if (!userMessage || typeof userMessage !== 'string') {
        res.status(400).json({ error: 'Mensaje de usuario requerido.' });
        return;
      }

      // If Gemini API is available on server
      if (ai) {
        try {
          // Construct conversation contents with recent history
          const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

          // Add history context (up to last 6 messages)
          const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
          for (const msg of recentHistory) {
            if (msg.role === 'user' || msg.role === 'model') {
              formattedContents.push({
                role: msg.role,
                parts: [{ text: msg.text || '' }],
              });
            }
          }

          // Contextual user note
          const contextNote = userContext
            ? `[Contexto de la colaboradora: Nombre ${userContext.name || 'Colega'}, Estado de ánimo hoy: ${userContext.mood || 'en proceso de calma'}, Rol: ${userContext.role || 'Colaboradora'}]\n\n`
            : '';

          formattedContents.push({
            role: 'user',
            parts: [{ text: `${contextNote}${userMessage}` }],
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction: PSYCHOLOGIST_SYSTEM_PROMPT,
              temperature: 0.7,
            },
          });

          if (response.text) {
            res.json({ reply: response.text });
            return;
          }
        } catch (geminiErr) {
          console.warn('Gemini generateContent notice (switching to empathetic fallback):', geminiErr);
        }
      }

      // Compassionate, clinically sound fallback responses if API key is not yet set
      const lower = userMessage.toLowerCase();
      let fallback = '';

      if (lower.includes('estres') || lower.includes('sobrecarga') || lower.includes('ansiedad') || lower.includes('mucho trabajo')) {
        fallback = `Te escucho con total empatía. Cuando el volumen de trabajo y las demandas externas se acumulan, es completamente natural que tu mente y tu cuerpo entren en modo de alerta. Quiero recordarte algo importante: tu valor como profesional no depende de resolverlo todo hoy ni de agotarte en el intento.\n\nHagamos una pausa juntos en este instante. Suelta tus hombros suavemente, afloja la mandíbula y toma una inhalación profunda en 4 segundos... sostén 2 segundos... y exhala liberando todo el aire despacio. ¿Qué es lo único en lo que necesitas enfocarte hoy de forma amable?`;
      } else if (lower.includes('impostor') || lower.includes('no soy suficiente') || lower.includes('miedo') || lower.includes('insegura')) {
        fallback = `Gracias por tener la valentía de compartir esto conmigo. El síndrome del impostor suele aparecer precisamente en personas comprometidas y talentosas que se exigen mucho a sí mismas. Esa voz interna crítica no es la realidad, es simplemente un eco del miedo al juicio.\n\nReconoce el camino que has recorrido y los desafíos que ya has superado para estar aquí. Date el permiso de aprender mientras avanzas. ¿Hay algún logro reciente del que puedas sentir orgullo hoy, por pequeño que parezca?`;
      } else if (lower.includes('respir') || lower.includes('calma') || lower.includes('pausa')) {
        fallback = `Perfecto, regalémonos este momento de quietud. Siéntate cómodamente con la espalda apoyada y los pies en el suelo. Cierra los ojos si te resulta agradable.\n\nInhala suavemente por la nariz contando mentalmente: uno, dos, tres, cuatro... Sostén el aire con tranquilidad: uno, dos, tres, cuatro... Y exhala lentamente por la boca como si soplaras una vela a la distancia: uno, dos, tres, cuatro, cinco, seis. Siente cómo la tensión se disuelve en cada exhalación. Estoy aquí contigo.`;
      } else {
        fallback = `Te escucho con atención y respeto. Es valioso que te regales este espacio para conectar con lo que estás viviendo. A veces, simplemente poner en palabras lo que sentimos nos permite ver las cosas con mayor serenidad y perspectiva.\n\nRecuerda que no estás sola en este proceso laboral y que es legítimo pedir apoyo o ir un paso a la vez. ¿Cómo te sientes en tu cuerpo en este momento?`;
      }

      res.json({ reply: fallback });
    } catch (err: unknown) {
      console.error('Error in psychologist endpoint:', err);
      res.status(500).json({
        error: 'No pudimos procesar tu mensaje en este momento.',
        fallback: 'Respira profundo. Estoy aquí para acompañarte; por favor inténtalo nuevamente en unos instantes.'
      });
    }
  });

  // Healthcheck endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Conecta & Brilla Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
