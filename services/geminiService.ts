import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Product } from '../types';

// Lazy initialization to prevent crashes if env var is missing during initial load
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getInventoryInsights = async (
  query: string,
  currentProducts: Product[]
): Promise<{ text: string; filter?: Partial<Product> }> => {
  
  const ai = getAIClient();
  if (!ai) {
    return { text: "API Key is missing. Please configure your environment variables." };
  }

  const productContext = JSON.stringify(currentProducts.map(p => ({
    name: p.name,
    category: p.category,
    stock: p.stock,
    price: p.price,
    status: p.stock < p.minStock ? 'Low Stock' : 'In Stock'
  })));

  const prompt = `
    Context: Current Inventory Data: ${productContext}
    User Query: "${query}"
    
    Task:
    1. Answer the user's question based on the inventory data.
    2. If the user is asking to find/show/filter specific items (e.g. "show me low stock items", "find electronics"), 
       provide a JSON object in the response with the key "filterCriteria" matching the product fields.
    
    Output Format: JSON
    {
      "answer": "Human readable answer here...",
      "filterCriteria": { "category": "Electronics" } // Optional, only if filtering is implied
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            filterCriteria: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                name: { type: Type.STRING },
                stockStatus: { type: Type.STRING, description: "Use 'low' for low stock items" }
              },
              nullable: true
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      text: result.answer || "I couldn't process that request.",
      filter: result.filterCriteria
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, I encountered an error analyzing the inventory." };
  }
};

export const getDemandForecast = async (productName: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Forecast unavailable (API Key missing).";

  const prompt = `
    Product: ${productName}
    Historical Context: Sales have been steady with a 5% increase month-over-month.
    Task: Generate a short, realistic demand forecast for the next month for this product. Mention specific projected units.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Forecast unavailable.";
  } catch (error) {
    console.error(error);
    return "Unable to generate forecast at this time.";
  }
};