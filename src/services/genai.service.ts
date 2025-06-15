import {genai} from "../config/geminiClient";


export default async function askGemini(prompt: string) {
  const result = await genai.models.generateContent({
    model: "gemini-2.0-flash",
    contents : prompt
  })
  return result?.text;
}
