import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
  // In a real production app, you would have a fallback or a more user-friendly error.
  // For this environment, we assume the key is always present.
  console.warn("API_KEY is not set. The application will not be able to contact Google services.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || " " });

const extractBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

const cleanJsonString = (rawText: string): string => {
  let jsonStr = rawText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  return jsonStr;
}

export const analyzeMenu = async (imageDataUrl: string): Promise<string[]> => {
  const base64Data = extractBase64(imageDataUrl);

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data,
    },
  };

  const textPart = {
    text: `Analyze this menu image. It may contain English or Chinese text.
           Identify all the dish names.
           Return the result as a single JSON array of strings.
           For example: ["Spaghetti Carbonara", "Caesar Salad", "麻婆豆腐"].
           Do not include prices or descriptions, only the names of the dishes.`
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
        },
    });

    const jsonStr = cleanJsonString(response.text);
    const dishNames: string[] = JSON.parse(jsonStr);

    if (!Array.isArray(dishNames) || !dishNames.every(item => typeof item === 'string')) {
      throw new Error('AI response is not a valid array of strings.');
    }
    
    return dishNames;

  } catch (error) {
    console.error("Error analyzing menu:", error);
    throw new Error("Failed to analyze the menu. The AI couldn't read the items. Please try another image.");
  }
};

export const generateImageForDish = async (dishName: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `A photorealistic, delicious-looking, professionally photographed plate of "${dishName}". Centered on a clean, minimalist restaurant table background. No text or watermarks.`,
            config: { 
                numberOfImages: 1, 
                outputMimeType: 'image/jpeg',
                aspectRatio: "1:1",
             },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error(`Error generating image for "${dishName}":`, error);
        throw new Error(`Failed to generate an image for "${dishName}".`);
    }
};
