
import { GoogleGenAI, Type, Modality } from "@google/genai";

let userApiKey: string | null = null;

export const setApiKey = (key: string) => {
  userApiKey = key;
  localStorage.setItem('zomigpt_api_key', key);
};

export const getApiKey = (): string | undefined => {
  if (userApiKey) return userApiKey;
  
  // Try to get from localStorage
  const stored = localStorage.getItem('zomigpt_api_key');
  if (stored) {
    userApiKey = stored;
    return stored;
  }
  
  // Try to get from environment (build-time)
  return process.env.API_KEY;
};

const getAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ API Key is missing!');
    console.error('  - Build-time key:', process.env.API_KEY ? '✓ Present' : '✗ Missing');
    console.error('  - localStorage:', localStorage.getItem('zomigpt_api_key') ? '✓ Present' : '✗ Missing');
    throw new Error('API_KEY_MISSING');
  }
  console.log('✓ API Key loaded successfully');
  return new GoogleGenAI({ apiKey });
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const chatWithGemini = async (message: string, imageBase64?: string, isPro = false, systemInstruction?: string) => {
  return withRetry(async () => {
    const ai = getAI();
    const contents: any[] = [{ text: message }];
    if (imageBase64) {
      contents.push({ inlineData: { mimeType: 'image/png', data: imageBase64 } });
    }
    const modelName = isPro ? 'gemini-2.0-flash-exp' : 'gemini-2.0-flash-exp';
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: contents },
      config: { 
        systemInstruction: systemInstruction || "You are ZomiGPT, a highly intelligent conversational AI for the Zomi community. You provide helpful, polite, and precise answers. Use Markdown for all formatting. You specialize in Zomi culture, history, and language, but you are a general-purpose model like ChatGPT." 
      }
    });
    return response.text;
  });
};

export const dictionaryLookup = async (word: string) => {
  return withRetry(async () => {
    const ai = getAI();
    const systemPrompt = `You are ZomiGPT's Lexicon Expert. Provide a professional dictionary entry for: "${word}".
    Structure: Headword, Part of Speech, Definition (English & Zomi), Example Sentences, and Cultural Notes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: word,
      config: { systemInstruction: systemPrompt }
    });
    return response.text;
  });
};

export const translateText = async (text: string, from: string, to: string) => {
  return withRetry(async () => {
    const ai = getAI();
    const systemPrompt = `Expert translator for ZomiGPT. Translate ${from} to ${to}. Provide only the result.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: text,
      config: { systemInstruction: systemPrompt }
    });
    return response.text;
  });
};

export const searchGrounding = async (query: string) => {
  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: query,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || '',
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || '#'
      })) || []
    };
  });
};

export const mapsGrounding = async (query: string, location?: { lat: number; lng: number }) => {
  return withRetry(async () => {
    const ai = getAI();
    const config: any = {
      tools: [{ googleMaps: {} }],
    };
    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng
          }
        }
      };
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config
    });
    return {
      text: response.text || '',
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.maps?.title || 'Map Location',
        uri: chunk.maps?.uri || '#'
      })) || []
    };
  });
};

export const generateImage = async (prompt: string, isPro = false) => {
  return withRetry(async () => {
    if (isPro) {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) await (window as any).aistudio?.openSelectKey();
    }
    const ai = getAI();
    const modelName = 'gemini-2.0-flash-exp';
    const imageConfig: any = { aspectRatio: "1:1" };
    if (isPro) {
      imageConfig.imageSize = "2K";
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated");
  });
};

export const generateSpeech = async (text: string, voiceName: string = 'Kore') => {
  return withRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  });
};

export const generateVideo = async (prompt: string, onStatus: (status: string) => void) => {
  const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
  if (!hasKey) await (window as any).aistudio?.openSelectKey();

  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });

  onStatus('Thinking...');
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
    onStatus('Generating...');
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const apiKey = getApiKey();
  return `${downloadLink}&key=${apiKey}`;
};
