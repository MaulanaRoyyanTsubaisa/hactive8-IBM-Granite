# Royyan IBM AI GRANITE, Live Preview : https://hactive8-ibm-granite.vercel.app/

# 🧠 Granite AI Assistant – Hactive8 x IBM x Maulana Royyan Tsubaisa

A conversational AI web application built with **Next.js 14**, powered by **IBM watsonx Granite 3.3 8B** model via the **Replicate API**. Features include AI-powered chatbot and code generator tabs with a sleek, responsive UI.

---

## 📋 Description

**Granite AI Assistant** is a modern web-based AI interface developed as a final project for the Hactive8 x IBM bootcamp by **Maulana Royyan Tsubaisa**.

This app integrates IBM's cutting-edge **Granite 3.3 8B Instruct** language model to provide natural language conversation and code generation capabilities.

---

## 🛠️ Technologies Used

- **Next.js 14 (App Router)**
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **IBM watsonx Granite** via [Replicate API](https://replicate.com/ibm-granite)
- **Vercel** (deployment ready)

---

## 🚀 Features

- 💬 **Chatbot Tab** — Ask anything, get natural responses from IBM Granite.
- 🧠 **Code Generator Tab** — Generate code snippets from prompts (HTML, JS, etc.).
- 🧪 **Granite 3.3 8B** — AI model by IBM optimized for code + language understanding.
- 💾 **Chat History (LocalStorage)** — Session-safe chat logs (client-side).
- ⚙️ **Responsive UI** — Fully optimized for desktop and mobile.

---

## ⚙️ Setup Instructions

### 1. Clone This Repository

```bash
git clone https://github.com/MaulanaRoyyanTsubaisa/hactive8-IBM-Granite.git
cd hactive8-IBM-Granite
2. Install Dependencies
npm install
# or
pnpm install

3. Setup Environment Variable
Buat file .env.local dan tambahkan:
REPLICATE_API_TOKEN=your_replicate_token_here
Get your token from https://replicate.com/account

4. Run Development Server
npm run dev
Akses: http://localhost:3000

🔌 API Endpoints
Method	Endpoint	Description
POST	/api/chat	Main chat endpoint (Granite model)
POST	/api/generate-code	Code generation via prompt
POST	/api/generate	Simulated response (offline testing)

🤖 AI Support Explanation
The application uses IBM Granite 3.3 8B Instruct, accessed via the Replicate API. Prompt formatting follows role-based messaging (Human: / Assistant:) and uses polling to handle asynchronous response generation.

This allows the app to deliver:

Natural, human-like responses in chat

Clean, syntactically correct code snippets

Fast and scalable cloud inference

📸 Screenshots
(Insert screenshots of UI, chatbot, and code generator output here)

👨‍💻 Author
Built by Maulana Royyan Tsubaisa
For Hactive8 x IBM Bootcamp Final Project – 2025

📄 License
This project is open-source for educational purposes. Modify and reuse with credit. No commercial use without permission.

```

