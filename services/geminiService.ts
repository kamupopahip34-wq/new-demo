
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with a named parameter for the API key from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeDashboard(data: any) {
  try {
    // Using gemini-3-pro-preview for advanced reasoning and analysis tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Dashboard Data: ${JSON.stringify(data)}`,
      config: {
        systemInstruction: "You are an expert platform analyst. Provide a professional summary of the task-earning platform's performance based on the provided data, along with 3 strategic suggestions for growth or efficiency.",
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "suggestions"]
        }
      }
    });
    // Access the .text property directly to retrieve the generated string
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}

export async function generateTaskDescription(topic: string) {
  try {
    // Using gemini-3-flash-preview for basic content generation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Task Topic: ${topic}`,
      config: {
        systemInstruction: "You are a creative content specialist for a micro-task app. Create a clear task title, an engaging description, and precise step-by-step instructions for the user to provide proof of completion.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            instruction: { type: Type.STRING }
          },
          required: ["title", "description", "instruction"]
        }
      }
    });
    // Access the .text property directly to retrieve the generated string
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Task Gen Error:", error);
    return null;
  }
}
