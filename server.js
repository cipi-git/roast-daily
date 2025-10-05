// server.js (CommonJS, cu rate-limit prietenos + retryAfter)
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
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
