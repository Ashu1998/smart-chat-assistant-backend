import dialogflow from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

export async function detectIntentFromDialogflow(message: string, sessionId: string) {
  const sessionClient = new dialogflow.SessionsClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
  });

  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.GOOGLE_PROJECT_ID!,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: process.env.DIALOGFLOW_LANGUAGE_CODE || "en",
      },
    },
  };

  const [response] = await sessionClient.detectIntent(request);
  console.log("getDialogflowResponse:", message, response);
  return response.queryResult;
}
