import { detectIntentFromDialogflow } from "./dialogflow.service";
import askGemini from "./genai.service";

async function handleUserMessage(message: string, sessionId: string) {
  const dfResult = await detectIntentFromDialogflow(message, sessionId);

  if (dfResult?.intent?.isFallback) {
    console.log('Fallback triggered. Using Gemini...');
    const geminiReply = await askGemini(message);
    return geminiReply;
  }

  return dfResult?.fulfillmentText || '[No Dialogflow response]';
}

export { handleUserMessage };
