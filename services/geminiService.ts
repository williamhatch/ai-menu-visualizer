
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MenuItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as data URL"));
      }
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

export const parseMenuFromImage = async (imageFile: File): Promise<MenuItem[]> => {
  const base64Image = await fileToBase64(imageFile);
  const imagePart = {
    inlineData: {
      mimeType: imageFile.type,
      data: base64Image,
    },
  };

  const prompt = `You are an expert menu parser. Analyze the provided image of a restaurant menu. Extract all food items. For each item, provide its name, a brief description if available, and its price. Return the data as a JSON array of objects. Each object must have the following keys: "name", "description", "price". If a description is not present for an item, create a short, appealing description based on the item's name. Ensure the output is only the JSON array. Do not include any other text or markdown.

Example format:
[
  {
    "name": "Classic Burger",
    "description": "A juicy beef patty with lettuce, tomato, and our special sauce.",
    "price": "$12.99"
  }
]`;

  const textPart = { text: prompt };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-04-17',
    contents: { parts: [imagePart, textPart] },
    config: {
        responseMimeType: "application/json",
    }
  });

  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }

  try {
    const parsedData = JSON.parse(jsonStr);
    if (Array.isArray(parsedData)) {
      return parsedData as MenuItem[];
    }
    throw new Error("Parsed data is not an array.");
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    console.error("Received text:", response.text);
    throw new Error("Could not understand the menu structure. Please try a clearer image.");
  }
};

export const generateImageForItem = async (menuItem: MenuItem): Promise<string> => {
    const prompt = `A delicious, high-quality, photorealistic image of ${menuItem.name}. ${menuItem.description}`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    
    throw new Error(`Could not generate image for ${menuItem.name}`);
};
