# Roast Daily — AI & Process Automation Lab

Roast Daily is a React/Vite application that now also contains a practical **AI Process Automation** prototype.

## AI Process Assistant

The project includes an Italian-first assistant that:
- analyzes a business process;
- identifies repetitive/manual activities;
- retrieves relevant internal knowledge from a small local knowledge base (RAG-style retrieval);
- proposes an automation workflow;
- highlights risks and next steps;
- returns structured JSON from the Gemini model.

### Architecture

`React UI → Express API → retrieval layer → Gemini → structured result`

The API key remains server-side in `GEMINI_API_KEY`.

## Tech Stack

- React 18 + Vite
- TailwindCSS
- Node.js + Express
- Google Gemini API
- REST API
- JSON structured outputs
- Lightweight local retrieval / RAG prototype

## Run locally

```bash
npm install
npm run dev
```

For the AI endpoints, configure `GEMINI_API_KEY` in the server environment.

## Portfolio purpose

This project demonstrates practical experimentation with **generative AI, AI assistants, retrieval, workflow design and business-process automation**, rather than only frontend development.
