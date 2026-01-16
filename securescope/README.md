# 🛡️ SecureScope: Compliance Q&A Agent

**SecureScope** is a high-fidelity, AI-powered Compliance Q&A Agent built for the hackathon. It specializes in **Access Control Policies**, ensuring that all answers are strictly grounded in official documentation with real-time citations.

![SecureScope UI Preview](https://github.com/SangeethaKumari/SecureScope/raw/main/securescope_ui_preview.png) *(Note: Add your own screenshot here after deployment)*

## 🚀 The Main Idea
In compliance, accuracy is everything. SecureScope prevents AI "hallucinations" by acting as a strict filter for company policies. If the answer isn't in the policy, SecureScope won't guess—it will strictly inform the user that the information is not specified.

### ✨ Key Features
- **Strict Policy Adherence**: Answers are generated **only** from the uploaded Access Control Policy.
- **Real-time Citations**: Every answer includes a direct source citation and a context snippet from the document.
- **"I Don't Know" Guardrail**: Intercepts queries not mentioned in the policy with a professional fallback message.
- **Premium UI/UX**: Built with a sleek **Glassmorphism** aesthetic, featuring dark mode, mesh gradients, and smooth animations.
- **Senso AI Integration**: Leverages the [Senso Context OS](https://docs.senso.ai/) for high-performance retrieval and grounded generation.

---

## 🛠️ Technology Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **AI Core**: [Senso API](https://docs.senso.ai/) (RAG as a Service)
- **Styling**: Tailwind CSS + Vanilla CSS (Glassmorphism effects)
- **Language**: TypeScript

---

## 📥 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- A [Senso](https://senso.ai) API Key

### 2. Installation
```bash
git clone https://github.com/SangeethaKumari/SecureScope.git
cd SecureScope/securescope
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the `securescope` directory:
```env
SENSO_API_KEY=your_senso_api_key_here
```

### 4. Ingesting the Policy
Before the agent can answer questions, you must upload the policy to Senso:
```bash
# From the project root
curl -X POST https://sdk.senso.ai/api/v1/content/file \
  -H "X-API-Key: YOUR_API_KEY" \
  -F "file=@../access_control_policy.md" \
  -F "title=Access Control Policy"
```

### 5. Running the App
```bash
npm run dev
```
Visit `http://localhost:3000` to interact with SecureScope.

---

## 📖 Sample Questions
- *"What is the minimum password length requirement?"*
- *"Who is responsible for approving firewall modifications?"*
- *"How quickly must access be revoked for offboarded employees?"*

---

## 🛡️ Compliance Rulebook
- **Rule 1**: Answer strictly using the Access Control Policy.
- **Rule 2**: If the policy does not explicitly mention the answer, respond with: *‘This information is not specified in the Access Control Policy.’*
- **Rule 3**: Always cite the policy as the source.

---
**Created for the Hackathon by SangeethaKumari**
