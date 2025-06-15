# 🧠 Smart Chat Assistant Backend

A production-ready, extensible backend that integrates **Dialogflow ES** for NLU and **Gemini Pro** (via `@google/genai`) as an intelligent fallback. It supports real-time communication through **Socket.IO**, secure user authentication, and persistent chat history using **MongoDB**.

---

## 🚀 Key Features

- 🤖 **Dialogflow ES Integration** – Intent detection and structured conversation flow
- 🧠 **Gemini Pro Fallback** – Smart replies using Google's Gemini model when Dialogflow fails
- 💬 **Socket.IO Real-Time Chat** – Bi-directional, event-driven messaging layer
- 🔐 **JWT Authentication** – Secure user identity verification
- 🗃️ **MongoDB Integration** – Stores chat history and user sessions
- ⚙️ **TypeScript-first** – Strongly typed for better maintainability and scalability

---

## 📡 Architecture Overview

1. Client sends message over Socket.IO
2. Message is processed:
   - → If Dialogflow detects intent → send fulfillment response
   - → If fallback is triggered → Gemini is queried via `@google/genai`
3. Response is returned to client
4. Interaction is logged in MongoDB

---

## 📦 Installation

```bash
git clone https://github.com/your-username/smart-chat-assistant-backend.git
cd smart-chat-assistant-backend
npm install
```

---

## 🛠️ Configuration

Create a `.env` file at the root:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/chatbot
JWT_SECRET=your-jwt-secret

# Google Dialogflow
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123...\n-----END PRIVATE KEY-----"
DIALOGFLOW_LANGUAGE_CODE=en

# Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

---

## 🧪 Development

```bash
npm run dev
```

The server runs on the port defined in `.env` (`5001` by default).

---

## 📁 Folder Structure

```
smart-chat-assistant-backend/
├── src/
│   ├── config/         # Config loaders and constants
│   ├── controllers/    # API controllers
│   ├── middleware/     # JWT, error, validation, etc.
│   ├── models/         # Mongoose schemas
│   ├── routes/         # REST API endpoints
│   ├── services/       # Business logic (Dialogflow + Gemini)
│   ├── socket/         # Socket.IO event handlers
│   ├── app.ts          # Express app
│   └── server.ts       # Entry point
├── .env                # Runtime variables
├── package.json
└── tsconfig.json
```

---

## 🔌 Real-time Messaging with Socket.IO

### Client → Server Event

```ts
socket.emit("chat", {
  message: "Tell me a joke",
  tokenPayload: {
    userId: "abc123"
  }
});
```

### Server → Client Event

```ts
socket.on("chatReply", (data: { reply: string }) => {
  console.log("Bot says:", data.reply);
});
```

---

## 🤖 Dialogflow + Gemini Fallback

- Dialogflow is used to handle structured intent-based responses.
- If the response triggers the `Default Fallback Intent`, the user message is sent to **Gemini Pro** via `@google/genai`.

### Gemini Integration Code Snippet

```ts
import { GoogleGenerativeAI } from "@google/genai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent("Explain quantum physics.");
console.log(await result.response.text());
```

---

## 🔍 API Endpoints

### Authentication

- `POST /api/auth/register` → Register a new user
- `POST /api/auth/login` → Authenticate and receive JWT token

---

## 🛡️ Error Handling

Robust validation and error catching:

- Invalid JWT → rejected at socket or HTTP layer
- Malformed input → handled at controller/middleware level
- Database + AI errors → gracefully caught and logged

---

## 📚 Dependencies

### Runtime

- `@google/genai` – Gemini Pro model SDK
- `@google-cloud/dialogflow` – Dialogflow API
- `socket.io` – Real-time engine
- `express` – REST server
- `mongoose` – MongoDB ORM
- `jsonwebtoken` – Secure auth
- `uuid`, `dotenv`, `bcryptjs`, etc.

### Dev

- `typescript`, `ts-node-dev`, and `@types/*`

---

## 🧑‍💻 Contributing

```bash
git checkout -b feature/my-feature
git commit -m "✨ Added new logic"
git push origin feature/my-feature
```

Open a PR 🚀

---

## 📄 License

MIT

---

## 🙋 Author

**Ashish Verma**  
Backend Engineer | Building smart, scalable assistants  
🌐 [GitHub](https://github.com/Ashu1998)