import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { generateSystemPrompt, searchWebsiteKnowledge, isUrduString } from './data/chatbotKnowledge';

export const apiRouter = Router();

// Rate limiting in-memory per IP: max 30 requests per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  record.count += 1;
  return true;
}

// Helper to synthesize speech for generated text
async function synthesizeSpeech(text: string, voiceName: string, apiKey?: string): Promise<string | null> {
  if (!apiKey || apiKey.length <= 5) return null;
  try {
    const cleanSpeech = text
      .replace(/(\*\*|\*|`|#|>|\[.*?\]\(.*?\))/g, '')
      .replace(/•|\-/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1000);

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const selectedVoice = ['Charon', 'Fenrir', 'Puck', 'Kore', 'Zephyr'].includes(voiceName)
      ? voiceName
      : 'Charon';

    const ttsTimeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TTS timeout')), 5000)
    );

    const ttsRes = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanSpeech,
                speechMetadata: {
                  style: 'Deep, calm, powerful masculine baritone, motivational and professional executive',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } },
          },
        },
      }),
      ttsTimeoutPromise,
    ]);

    const b64 = ttsRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return b64 ? `data:audio/wav;base64,${b64}` : null;
  } catch (err) {
    console.warn('Speech synthesis skipped:', err);
    return null;
  }
}

// 1. Status Endpoint
apiRouter.get('/status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'online',
    provider: 'Google Gemini',
    model: 'gemini-3.8-flash',
    hasApiKey: hasKey,
    brand: 'ASPIRE WORK',
  });
});

// 2. Chat Endpoint
apiRouter.post('/chat', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-client';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
    });
  }

  const { messages, generateVoice = true, voice = 'Charon', language = 'en' } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request: "messages" must be a non-empty array.' });
  }

  // Validate message payload
  const sanitizedMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const msg of messages.slice(-12)) {
    if (!msg || typeof msg.content !== 'string') continue;
    const role = msg.role === 'assistant' ? 'assistant' : 'user';
    const content = msg.content.trim().slice(0, 2000);
    if (content.length > 0) {
      sanitizedMessages.push({ role, content });
    }
  }

  if (sanitizedMessages.length === 0) {
    return res.status(400).json({ error: 'Message content cannot be empty.' });
  }

  const lastUserMessage = [...sanitizedMessages].reverse().find((m) => m.role === 'user');
  if (!lastUserMessage) {
    return res.status(400).json({ error: 'No user message provided.' });
  }

  const effectiveLanguage: 'en' | 'ur' =
    language === 'ur' || isUrduString(lastUserMessage.content) ? 'ur' : 'en';

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If real Gemini API key is configured, invoke the official @google/genai SDK
  if (apiKey && apiKey.length > 5) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Convert conversation history to Gemini contents format
      const contents = sanitizedMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 8000)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: generateSystemPrompt(effectiveLanguage),
            temperature: 0.7,
            topP: 0.95,
          },
        }),
        timeoutPromise,
      ]);

      const replyText = response.text?.trim() || 'No response generated from the model.';

      let audioUrl: string | null = null;
      if (generateVoice) {
        audioUrl = await synthesizeSpeech(replyText, voice, apiKey);
      }

      return res.json({
        reply: replyText,
        audio: audioUrl,
        voice,
        language: effectiveLanguage,
        isDemoMode: false,
        model: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini API synthesis error:', err);
      const fallbackReply = searchWebsiteKnowledge(lastUserMessage.content, effectiveLanguage);
      let audioUrl: string | null = null;
      if (generateVoice) {
        audioUrl = await synthesizeSpeech(fallbackReply, voice, apiKey);
      }
      return res.json({
        reply: fallbackReply,
        audio: audioUrl,
        voice,
        language: effectiveLanguage,
        isDemoMode: true,
        notice: `Displaying verified knowledge base answer. (${err?.message || 'API fallback'})`,
      });
    }
  }

  // If no GEMINI_API_KEY is configured in environment, serve from verified website knowledge
  const fallbackReply = searchWebsiteKnowledge(lastUserMessage.content, effectiveLanguage);
  return res.json({
    reply: fallbackReply,
    audio: null,
    voice,
    language: effectiveLanguage,
    isDemoMode: true,
    notice: 'Demo Mode: Running on ASPIRE WORK verified knowledge base.',
  });
});

// 3. Voice TTS Endpoint
apiRouter.post('/voice', async (req, res) => {
  const { text, voice = 'Charon' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required for voice synthesis.' });
  }

  const cleanSpeech = text
    .replace(/(\*\*|\*|`|#|>|\[.*?\]\(.*?\))/g, '')
    .replace(/•|\-/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1000);

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (apiKey && apiKey.length > 5) {
    try {
      const audioUrl = await synthesizeSpeech(cleanSpeech, voice, apiKey);
      if (audioUrl) {
        return res.json({
          audio: audioUrl,
          voice,
          format: 'audio/wav',
          isNeural: true,
        });
      }
    } catch (err: any) {
      console.warn('Voice synthesis fallback:', err?.message);
    }
  }

  return res.json({
    audio: null,
    useBrowserTts: true,
    text: cleanSpeech,
    notice: 'Using browser voice synthesis fallback.',
  });
});

// 4. Transcription Endpoint
apiRouter.post('/transcribe', async (req, res) => {
  const { audioData, mimeType = 'audio/webm' } = req.body;

  if (!audioData) {
    return res.status(400).json({ error: 'Audio data is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (apiKey && apiKey.length > 5) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const base64Clean = audioData.replace(/^data:audio\/\w+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Clean,
              },
            },
            { text: 'Transcribe this spoken English audio exactly and concisely.' },
          ],
        },
      });

      const transcript = response.text?.trim() || '';
      return res.json({ transcript });
    } catch (err: any) {
      console.warn('Gemini Transcribe fallback:', err?.message);
      return res.status(500).json({ error: 'Transcription failed.', details: err?.message });
    }
  }

  return res.status(503).json({ error: 'API key not configured for server transcription.' });
});
