// server.js (CommonJS, cu rate-limit prietenos + retryAfter)
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { retrieveRelevantDocuments } = require("./data/processKnowledge.js");
require("dotenv").config();

const PORT = process.env.PORT || 5080;
const MODEL_ID = process.env.MODEL_ID || "gemini-1.5-flash-8b";
const API_KEY = process.env.GEMINI_API_KEY;

const app = express();
app.use(cors());
app.use(bodyParser.json());

let hits = [];
const WINDOW_MS = 60_000;
const MAX_RPM = 8;
function rateLimited() {
  const now = Date.now();
  hits = hits.filter(t => now - t < WINDOW_MS);
  if (hits.length >= MAX_RPM) return true;
  hits.push(now);
  return false;
}

app.post("/ai/analyze-process", async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: "AI service is not configured" });
    if (rateLimited()) {
      return res.status(429).json({ error: "rate_limited", retryAfter: 10 });
    }
    const { process, lang = "en" } = req.body || {};
    if (!process || process.trim().length < 10) {
      return res.status(400).json({ error: "A process description is required" });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });
    const prompt = `Analyze this business process for automation opportunities.
Return ONLY valid JSON with this shape:
{"opportunities":["..."],"automation":"...","impact":"..."}
Language: ${lang === "it" ? "Italian" : lang === "ro" ? "Romanian" : "English"}.
Focus on repetitive/manual steps, data entry, document handling, approvals, notifications and integrations.
Do not invent facts about the company.

Process:
${process.trim()}`;
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim().replace(/^\`\`\`json\s*/i, "").replace(/\s*\`\`\`$/i, "");
    const parsed = JSON.parse(raw);
    return res.json({
      opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities.slice(0, 6) : [],
      automation: String(parsed.automation || ""),
      impact: String(parsed.impact || ""),
    });
  } catch (e) {
    console.error("Process analysis error:", e?.message || e);
    return res.status(500).json({ error: "process_analysis_failed" });
  }
});

app.post("/ai/roast", async (req, res) => {
  try {
    if (!API_KEY) return res.json({ text: "" });
    if (rateLimited()) {
      return res.status(429).json({ text: "", retryAfter: 10, reason: "rate_limited" });
    }
    const { prompt } = req.body || {};
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });
    const result = await model.generateContent(prompt || "One short-to-medium roast.");
    const text = (result && result.response && result.response.text && result.response.text()) || "";
    return res.json({ text });
  } catch (e) {
    const msg = String(e?.message || "");
    const m = msg.match(/Retry.*?(\d+(\.\d+)?)s/i);
    const retryAfter = m ? Math.ceil(parseFloat(m[1])) : 10;
    console.error("AI proxy error:", msg);
    return res.status(429).json({ text: "", retryAfter, reason: "upstream_quota" });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy running on http://localhost:${PORT}`);
});
