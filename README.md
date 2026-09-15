# Roast Daily — AI Process Assistant & Automation Lab

Roast Daily started as a fun React/Vite web application and has been extended with a practical **AI Process Assistant** prototype focused on business-process analysis and automation.

The AI feature is designed as a portfolio project to demonstrate practical skills relevant to **Generative AI, AI assistants, RAG, workflow automation and process improvement**.

## What the AI Process Assistant does

A user describes a business process in natural language, for example:

> We receive invoices by email, download the attachments, check the data manually, enter the information into Excel and send a monthly report.

The assistant then produces a structured analysis in Italian, including:

- **Process summary** — what the current process looks like.
- **Automation opportunities** — repetitive activities that could be automated.
- **Suggested workflow** — a clearer target workflow.
- **Risks & attention points** — manual errors, scalability, data integrity, security and compliance considerations.
- **Next steps** — practical actions such as As-Is analysis, technology evaluation, stakeholder alignment and a pilot project.
- **Internal sources** — relevant documents retrieved from the project's local knowledge base.

## AI / RAG architecture

The current architecture is:

```text
User
  ↓
React / Vite UI
  ↓
Process Analyzer component
  ↓
Express / Node.js API
  ↓
Lightweight local retrieval layer (RAG-style)
  ↓
Relevant internal knowledge
  ↓
Google Gemini
  ↓
Structured JSON response
  ↓
React result cards
```

The API key is kept server-side and is loaded through environment variables.

## Why this is a RAG-style project

The assistant does not rely only on the user's prompt.

Before generating the answer, the backend retrieves relevant content from a small internal knowledge base. Those retrieved sources are added to the model context so that the analysis can be grounded in project-specific information.

This prototype demonstrates the core RAG pattern:

1. Receive the user's process description.
2. Retrieve relevant internal information.
3. Add the retrieved context to the AI prompt.
4. Generate a structured analysis.
5. Return the result to the frontend.

## Example

### Input

```text
Riceviamo fatture via email, scarichiamo gli allegati,
controlliamo manualmente i dati, inseriamo le informazioni
in Excel e alla fine inviamo un report mensile.
```

### Output

The assistant can identify opportunities such as:

- automatic email and attachment processing;
- OCR / Intelligent Document Processing;
- automated data validation;
- integration with an existing management system;
- automated monthly reporting.

It can also identify risks and propose a practical pilot project.

## Tech Stack

- **React 18**
- **Vite**
- **Tailwind CSS**
- **Node.js**
- **Express**
- **Google Gemini API**
- **REST API**
- **JSON structured responses**
- **Local retrieval / lightweight RAG**
- **Git / GitHub**

## Project structure

```text
roast-daily/
├── src/
│   ├── components/
│   │   └── ProcessAnalyzer.jsx
│   └── ...
├── server.js
├── package.json
├── vite.config.js
└── README.md
```

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
MODEL_ID=gemini-2.5-flash
PORT=8787
VITE_AI_PROXY_URL=http://localhost:8787/ai/roast
```

**Never commit your real API key to GitHub.**

### 3. Start the frontend

```bash
npm run dev
```

The Vite application runs at:

```text
http://localhost:5173
```

### 4. Start the AI backend

In a second terminal:

```bash
node server.js
```

The AI proxy runs at:

```text
http://localhost:8787
```

## Main AI endpoint

The Process Assistant uses:

```text
POST /ai/process-assistant
```

Example request:

```json
{
  "process": "Riceviamo fatture via email e inseriamo i dati in Excel.",
  "lang": "it"
}
```

The endpoint returns structured data containing fields such as:

```json
{
  "summary": "...",
  "opportunities": [],
  "workflow": [],
  "risks": [],
  "next_steps": [],
  "sources": []
}
```

## Portfolio / job relevance

This project demonstrates hands-on experimentation with:

- Generative AI;
- AI assistants;
- prompt and output design;
- RAG-style retrieval;
- business-process analysis;
- workflow design;
- automation opportunities;
- API integration;
- structured AI responses;
- frontend integration;
- practical problem solving and debugging.

The project is intentionally focused on a **real business use case**, rather than being only a generic chatbot.

It can be used as a practical portfolio example when discussing roles involving **AI, process innovation, automation and digital transformation**.

## Current status

**Working prototype**

The AI Process Assistant has been tested end-to-end locally:

```text
React UI → Node/Express API → retrieval → Gemini → structured JSON → React UI
```

The original Roast Daily functionality remains part of the application.

## Future improvements

Potential next iterations include:

- richer document ingestion;
- vector embeddings and a vector database;
- more advanced RAG evaluation;
- document upload and indexing;
- authentication and role-based access;
- workflow execution through automation platforms;
- process-efficiency scoring;
- human-in-the-loop approval;
- audit logging;
- production deployment.

---

Built as a practical AI and process-automation portfolio project.
