import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

const MODEL = "gemini-2.5-flash-lite";

const PROMPT =
  "Return exactly 3 friendly anonymous message prompts for a social app. Output one line only, questions separated by || with no numbering or extra text. Example: What's a hobby you enjoy?||What song are you looping lately?||What's your comfort food?";

export const maxDuration = 30;

export async function POST() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GOOGLE_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        maxOutputTokens: 80,
        temperature: 0.8,
      },
    });

    const result = await model.generateContentStream(PROMPT);
    const stream = GoogleGenerativeAIStream(result);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("suggest-messages error:", error);
    return Response.json(
      { error: "Failed to generate message suggestions" },
      { status: 500 }
    );
  }
}
