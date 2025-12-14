import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Helper to get a fresh client instance (important for Veo key switching)
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string, aspectRatio: string, isPro: boolean): Promise<string> => {
  const ai = getClient();
  const model = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  // For Pro model, we might need to ensure key selection if we were strictly following Veo patterns, 
  // but usually standard API key works if configured. 
  // However, specifically for the "Pro Image" preview, specific billing might apply.
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any, 
          imageSize: isPro ? "1K" : undefined, // Only pro supports size config currently
        }
      }
    });

    // Parse response for image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Изображение не найдено в ответе.");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

export const checkVeoAuth = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const requestVeoAuth = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    throw new Error("API Key selection not available in this environment.");
  }
};

export const generateVideo = async (prompt: string, aspectRatio: string): Promise<string> => {
  // Always create a new client right before the call to ensure correct key is used
  const ai = getClient();
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio as any // '16:9' or '9:16'
      }
    });

    // Polling loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Не удалось получить URI видео.");
    }

    // Append API Key to fetch the video content
    return `${videoUri}&key=${process.env.API_KEY}`;
  } catch (error) {
    console.error("Video generation error:", error);
    throw error;
  }
};