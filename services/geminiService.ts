import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const findSimilarAnimeCharacter = async (
  imageBase64: string,
  mimeType: string,
  strictness: 'resemblance' | 'exact',
  animeSeriesName?: string
): Promise<{ character_name: string; series_name: string }> => {
  let prompt = `Analyze the person in this image and identify the most similar popular and well-known anime character. ${
    strictness === 'exact'
      ? 'The character should be an exact match or an extremely close doppelganger. Focus on precise facial structure, hairstyle, and overall appearance.'
      : 'The character should share a strong resemblance or similar vibe. The match can be based on key features like hair color, eye shape, or general aesthetic.'
  }`;

  if (animeSeriesName && animeSeriesName.trim()) {
    prompt += ` The character MUST be from the anime series "${animeSeriesName}".`;
  } else {
    prompt += ` Do not choose obscure or side characters.`;
  }
  
  prompt += ` Respond with only a JSON object containing "character_name" and "series_name". If you cannot find a suitable character in the specified series, respond with a JSON object where "character_name" is "No Match Found" and "series_name" is the name of the series provided.`;


  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          character_name: {
            type: Type.STRING,
            description: "The name of the identified anime character, or 'No Match Found'.",
          },
          series_name: {
            type: Type.STRING,
            description: "The name of the anime series the character is from.",
          },
        },
        required: ["character_name", "series_name"],
      },
    },
  });

  try {
    let jsonString = response.text.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.substring(3, jsonString.length - 3).trim();
    }
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text);
    throw new Error("Could not identify an anime character. The AI response was not valid JSON.");
  }
};

export const transformImage = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
  }

  throw new Error("Image generation failed. No image data received from the API.");
};