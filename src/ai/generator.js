const DEFAULTS = { maxChars: 220, maxSentences: 2 };
const PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || "http://localhost:5080/ai/roast";

const localeHints = {
  ro: "Scrie un roast scurt spre mediu (max 2 propoziții, sub 220 de caractere). Fără emoji, hashtag-uri sau ghilimele.",
  en: "Write a short-to-medium roast (max 2 sentences, under 220 characters). No emojis, hashtags, or quotes."
};

const variantHints = {
  light: "tone: playful, gentle tease",
  medium: "tone: witty, a bit spicy",
  savage: "tone: harsh but safe; no slurs",
  smart: "tone: clever wordplay, concise",
  personal: "tone: personal; include the provided name naturally"
};

const pool = {
  ro: [
    "Ai Wi-Fi cu parolă greșită și idei pe modul avion.",
    "Promiți de mâine, dar calendarul tău e în buclă de snooze.",
    "Ești progres bar la 99% din 2010, update-ul vine „imediat”.",
    "Îți faci backup doar la scuze și restore la amânări.",
    "Îți încarci motivația la priză de decor."
  ],
  en: [
    "You’re a progress bar at 99% since 2010—update ‘coming soon’.",
    "Your goals are on airplane mode; excuses have full signal.",
    "All cache, no content; you refresh only the excuses tab.",
    "You RSVP to effort with ‘maybe’ and ghost the follow-up.",
    "Motivation plugged into a dead outlet."
  ]
};

const clean = (s) => String(s || "").replace(/\s+/g, " ").replace(/^["'“”‘’]|["'“”‘’]$/g, "").trim();

const firstSentences = (s, n) => {
  const parts = clean(s).split(/(?<=[.!?…])\s+/);
  return parts.slice(0, Math.max(1, n || 1)).join(" ").trim();
};

const cutAt = (s, max) => {
  const limit = Math.max(40, max || DEFAULTS.maxChars);
  if (s.length <= limit) return s;
  let cut = s.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > 60) cut = cut.slice(0, lastSpace);
  return cut.replace(/[,:;–-]\s*$/, "").trim() + "…";
};

const ensureName = (text, friendName) => {
  const out = clean(text);
  if (!friendName) return out;
  const has = new RegExp(`\\b${friendName}\\b`, "i").test(out);
  return has ? out : `${friendName}, ${out}`;
};

async function callModel({ prompt, lang }) {
  const body = JSON.stringify({ prompt, lang });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const wait = Number(data?.retryAfter || 10);
        if (attempt === 0) {
          await new Promise(r => setTimeout(r, wait * 1000));
          continue;
        }
        return "";
      }
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      return data.text || data.output || data.result || "";
    } catch {
      if (attempt === 0) continue;
      return "";
    }
  }
  return "";
}

function fallback(lang) {
  const arr = pool[lang] || pool.en;
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateAIRoast({
  lang = "ro",
  variant = "smart",
  friendName = "",
  seed = "",
  maxChars = DEFAULTS.maxChars,
  maxSentences = DEFAULTS.maxSentences
} = {}) {
  const hint = localeHints[lang] || localeHints.en;
  const vhint = variantHints[variant] || variantHints.smart;

  const prompt = [
    hint,
    vhint,
    friendName ? `Name: ${friendName}` : "",
    "Address the person directly and include the name naturally.",
    seed ? `Inspiration: ${seed}` : "",
    "Return plain text only."
  ].filter(Boolean).join("\n");

  let txt = await callModel({ prompt, lang });
  if (!txt) txt = fallback(lang);

  let out = firstSentences(txt, maxSentences);
  out = cutAt(out, maxChars);
  out = ensureName(out, friendName);
  out = clean(out);

  if (!out) out = lang === "ro" ? "Ai Wi-Fi cu parolă greșită." : "Wi-Fi on, ideas off.";
  return out;
}

export const nextRoast = generateAIRoast;
export const getRandomRoast = generateAIRoast;
export default generateAIRoast;
