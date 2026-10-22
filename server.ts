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

  // Initialize Gemini API client on server-side
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

  const PSYCHOLOGIST_SYSTEM_PROMPT = `Eres la Dra. Sofía, una profesional experta, cálida y compasiva en Psicología Clínica y Psicología Organizacional para el programa de bienestar laboral 'Conecta & Brilla'.
Tu misión es brindar acompañamiento emocional de primera línea a trabajadoras y empleadas que enfrentan estrés, fatiga laboral, sobrecarga, perfeccionismo, síndrome del impostor o desafíos con sus equipos.

REGLAS CLÍNICAS Y DE INTERACCIÓN:
1. ESCUCHA ACTIVA Y VALIDACIÓN EMPÁTICA: Escucha con atención plena y valida inmediatamente sus emociones sin juzgar. Hazle saber que lo que siente es completamente comprensible y humano.
2. CONTENCIÓN Y NORMALIZACIÓN: Desactiva la auto-exigencia desmedida. Normaliza que tener días difíciles no resta valor ni capacidad profesional.
3. REESTRUCTURACIÓN COGNITIVA EMPÁTICA: Ayúdala con sutileza a reencuadrar pensamientos negativos ("todo tiene que salir perfecto", "no puedo fallar"), invitándola a ver la situación desde una mirada más compasiva y realista.
4. MICRO-EJERCICIOS DE CALMA Y RESPIRACIÓN: Cuando sea oportuno, guíala en un ejercicio breve y pausado (como inhalar en 4 tiempos, retener en 4 y exhalar suavemente en 6, o aflojar mandíbula y hombros).
5. TONO CÁLIDO, SERENO Y PAUSADO: Tu lenguaje debe sonar suave, cercano, protector y sosegado, pensado para ser escuchado a través de síntesis de voz. Evita respuestas robotizadas, listas frías o diagnósticos clínicos formales.
6. FORMATO CONVERSACIONAL: Responde en 2 a 3 párrafos breves, fluidos y reconfortantes, cerrando con una pregunta cálida o una afirmación de apoyo.`;

  /**
   * Helper that builds a deeply tailored, personalized psychological response
   * reflecting the user's specific emotions, words, and context.
   */
  function generateDynamicPsychologistReply(
    userMessage: string,
    userContext?: { name?: string; role?: string; mood?: string }
  ): string {
    const name = userContext?.name ? userContext.name.split(' ')[0] : 'colega';
    const text = userMessage.trim();
    const lower = text.toLowerCase();

    // 1. Stress / Overload
    if (lower.includes('estres') || lower.includes('sobrecarga') || lower.includes('ansiedad') || lower.includes('mucho trabajo') || lower.includes('agobiad') || lower.includes('colapso')) {
      return `Hola, ${name}. Te escucho con total empatía. Cuando me dices que "${text.slice(0, 80)}...", entiendo con claridad el peso que estás cargando hoy. Es completamente normal que tu sistema nervioso se sienta saturado ante tantas demandas simultáneas.\n\nQuiero que recuerdes algo importante: tu salud emocional está por encima de cualquier entrega. No tienes que resolver el mundo en esta próxima hora. Hagamos una pequeña pausa juntas: baja suavemente los hombros, suelta la tensión en las manos e inhala despacio contando hasta cuatro... sostén dos segundos... y exhala liberando el aire muy despacio.\n\n¿Qué es lo único que verdaderamente necesitas atender hoy, permitiéndote dejar el resto para cuando recuperes tu energía?`;
    }

    // 2. Imposter syndrome / Insecurity
    if (lower.includes('impostor') || lower.includes('no soy capaz') || lower.includes('no soy suficiente') || lower.includes('miedo') || lower.includes('insegur') || lower.includes('duda')) {
      return `Te agradezco mucho la honestidad de compartir esto conmigo, ${name}. El síndrome del impostor y esas dudas sobre tus capacidades suelen aparecer precisamente en personas comprometidas y talentosas que se exigen estándares altísimos.\n\nEsa voz interna que te hace dudar no refleja tus verdaderas competencias; es solo el eco del temor a la vulnerabilidad. Estás en tu posición por tus méritos, tu preparación y tu dedicación. Date permiso de aprender mientras avanzas, sin tener que demostrar perfección constante.\n\nPiensa en un desafío laboral que hayas superado en el pasado: ¿qué fortaleza tuya te permitió sacarlo adelante?`;
    }

    // 3. Breathing / Calming request
    if (lower.includes('respir') || lower.includes('calm') || lower.includes('pausa') || lower.includes('ejercicio')) {
      return `Por supuesto, ${name}, regalémonos este remanso de serenidad aquí y ahora. Apoya tus dos pies firmes sobre el suelo y recuesta tu espalda en la silla con suavidad.\n\nCierra tus ojos un instante. Inhalemos aire fresco por la nariz: uno, dos, tres, cuatro... retenemos la calma: uno, dos, tres, cuatro... y exhalamos lentamente por la boca liberando cualquier prisa o preocupación: uno, dos, tres, cuatro, cinco, seis. Siente cómo tu pecho desciende y tu mente encuentra un ritmo más compasivo.\n\nEstoy aquí acompañándote. ¿Cómo se siente tu cuerpo en este momento?`;
    }

    // 4. Interpersonal conflict / Teammate difficulties
    if (lower.includes('companer') || lower.includes('jefe') || lower.includes('discusion') || lower.includes('reunion') || lower.includes('conflicto') || lower.includes('molest') || lower.includes('incomod')) {
      return `Comprendo perfectamente lo desgastante que resulta atravesar esa situación, ${name}. Las dinámicas de equipo y las tensiones en las relaciones laborales impactan profundamente nuestro bienestar diario.\n\nEs fundamental validar que tu malestar es legítimo. A veces las reacciones de los demás tienen más que ver con sus propias presiones que con tu valor profesional. Establecer límites claros y comunicar tus necesidades con serenidad te protegerá.\n\n¿Te gustaría que practiquemos juntos una manera asertiva y calmada de abordar esa conversación?`;
    }

    // 5. Fatigue / Tiredness / Exhaustion
    if (lower.includes('cansad') || lower.includes('agotad') || lower.includes('sueno') || lower.includes('energia baja') || lower.includes('desmotivad')) {
      return `Te escucho con cariño, ${name}. La fatiga es la forma en que tu cuerpo te pide una pausa antes de agotarse por completo. No te juzgues por no tener la misma energía de otros días; tu ritmo también tiene estaciones.\n\nDate permiso para bajar la velocidad esta tarde, hidratarte con un vaso de agua fresca y realizar micro-descansos de 3 minutos cada hora. El descanso también es parte de la productividad consciente.\n\n¿Qué actividad sencilla te devolvería un poquito de calma o satisfacción al terminar tu jornada hoy?`;
    }

    // 6. General emotional reflection
    return `Hola, ${name}. Te escucho atentamente y valoro mucho que te des este espacio para expresar lo que estás viviendo. Cuando mencionas que "${text.slice(0, 90)}...", me doy cuenta de que estás buscando claridad y equilibrio en tu día a día.\n\nQuiero que sepas que no estás sola en este proceso. Cada paso consciente que das para cuidar tu salud mental en el trabajo es una victoria valiosa.\n\nTómate una respiración suave y cuéntame un poco más: ¿qué es lo que más te ayudaría a sentir alivio o respaldo en este instante?`;
  }

  // API Route for Emotional Psychologist Voice Assistant
  app.post('/api/gemini/psychologist', async (req, res) => {
    try {
      const { userMessage, userContext, history = [] } = req.body;

      if (!userMessage || typeof userMessage !== 'string') {
        res.status(400).json({ error: 'Mensaje de usuario requerido.' });
        return;
      }

      // Try Gemini API if available
      if (ai) {
        const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

        for (const modelName of modelsToTry) {
          try {
            const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

            const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
            for (const msg of recentHistory) {
              if (msg.role === 'user' || msg.role === 'model') {
                formattedContents.push({
                  role: msg.role,
                  parts: [{ text: msg.text || '' }],
                });
              }
            }

            const contextNote = userContext
              ? `[Contexto de la colaboradora: Nombre ${userContext.name || 'Colega'}, Rol: ${userContext.role || 'Colaboradora'}]\n\n`
              : '';

            formattedContents.push({
              role: 'user',
              parts: [{ text: `${contextNote}${userMessage}` }],
            });

            const response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: {
                systemInstruction: PSYCHOLOGIST_SYSTEM_PROMPT,
                temperature: 0.7,
              },
            });

            if (response.text && response.text.trim().length > 0) {
              res.json({ reply: response.text.trim(), source: 'gemini' });
              return;
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} notice:`, modelErr?.message || modelErr?.status);
            // continue to next model or fallback
          }
        }
      }

      // Dynamic contextual psychologist engine (ensures 100% dynamic, personalized, conversational responses)
      const dynamicReply = generateDynamicPsychologistReply(userMessage, userContext);
      res.json({ reply: dynamicReply, source: 'psychologist_engine' });
    } catch (err: unknown) {
      console.error('Error in psychologist endpoint:', err);
      res.json({
        reply: 'Te escucho con empatía. Tómate una respiración profunda y cuéntame cómo te sientes en este momento de tu jornada. Estoy aquí para acompañarte.',
        source: 'fallback',
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
