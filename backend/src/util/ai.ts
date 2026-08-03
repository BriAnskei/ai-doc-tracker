import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_AI_KEY is not configured");
}

export const ai = new GoogleGenerativeAI(apiKey);

export function getGenerativeModel() {
  return ai.getGenerativeModel({ model: "gemini-2.5-flash" });
}
