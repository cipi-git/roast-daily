import { useState } from "react";
import { openWhatsApp, copyToClipboard } from "../utils/share";
import { getRoastCount, bumpRoastCount, formatNumber } from "../utils/counter";
import { t } from "../i18n";

const baseModes = (lang) => [
  { key: "light", label: t(lang, "mode_light") },
  { key: "medium", label: t(lang, "mode_medium") },
  { key: "savage", label: t(lang, "mode_savage") },
  { key: "ai", label: t(lang, "mode_ai") },
];

const aiVariants = (lang) => [
  { key: "smart", label: t(lang, "ai_smart") },
  { key: "light", label: t(lang, "ai_light") },
  { key: "medium", label: t(lang, "ai_medium") },
  { key: "savage", label: t(lang, "ai_savage") },
  { key: "personal", label: t(lang, "ai_personal") },
];

const lengthPresets = {
  short: { maxChars: 120, maxSentences: 1, label: "Short" },
  medium: { maxChars: 180, maxSentences: 2, label: "Medium" },
  long: { maxChars: 220, maxSentences: 2, label: "Long" },
};

const noPreviewUrl = (raw) =>
  raw.replace("dailygenius.app", `dailygenius.\u200Bapp`);

export default function RoastCard({
  lang = "ro",
  initialRoast,
  onGenerateRoast,
  onGenerateAIRoast, // ({ variant, friendName, seed, maxChars, maxSentences })
  onSaveImage,
}) {
  const [roast, setRoast] = useState(initialRoast || "");
  const [friendName, setFriendName] = useState("");
  const [mode, setMode] = useState("light");
  const [aiVariant, setAiVariant] = useState("smart");
  const [aiLength, setAiLength] = useState("long");
  const [sent, setSent] = useState(getRoastCount());
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const personalize = (text, name) =>
    name ? text.replace(/\[friend\]/gi, name) : text;

  const handleGenerate = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "ai") {
        const preset = lengthPresets[aiLength] || lengthPresets.long;
        const next = await onGenerateAIRoast?.({
          variant: aiVariant,
          friendName,
          seed: roast,
          maxChars: preset.maxChars,
          maxSentences: preset.maxSentences,
        });
        if (next) setRoast(next);
      } else {
        const base = onGenerateRoast?.(mode);
        if (base) setRoast(personalize(base, friendName));
      }
    } finally {
      setBusy(false);
    }
  };

  const openPopup = (u) =>
    window.open(u, "_blank", "noopener,noreferrer,width=600,height=540");
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://dailygenius.app/";

  const handleWhatsApp = () => {
    openWhatsApp(roast, lang);
    setSent(bumpRoastCount(1));
  };
  const handleFacebook = () => {
    openPopup(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`
    );
    setSent(bumpRoastCount(1));
  };
  const handleTwitter = () => {
    openPopup(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(roast)}`
    );
    setSent(bumpRoastCount(1));
  };

  const handleMessenger = async () => {
    const message = `${roast}\n${noPreviewUrl(currentUrl)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Roast Daily", text: message });
        setSent(bumpRoastCount(1));
        return;
      }
    } catch {}
    try {
      await copyToClipboard(message);
      alert("Mesaj copiat — deschide Messenger și lipește.");
    } catch {}
    openPopup("https://www.messenger.com/");
    setSent(bumpRoastCount(1));
  };

  const handleNativeShare = async () => {
    const message = `${roast}\n${currentUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Roast Daily",
          text: message,
          url: undefined,
        });
      } else {
        await copyToClipboard(message);
        alert("Link copiat!");
      }
      setSent(bumpRoastCount(1));
    } catch {}
  };

  const handleCopy = async () => {
    await copyToClipboard(roast);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const modes = baseModes(lang);
  const variants = aiVariants(lang);

  return (
    <div className="mx-auto w-full rounded-3xl bg-white p-6 shadow-xl ring-1 ring-zinc-200">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <input
          type="text"
          placeholder={t(lang, "input_friend")}
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-zinc-200">
          {modes.map((m) => {
            const active = mode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  active
                    ? "bg-black text-white"
                    : "text-zinc-700 hover:bg-white"
                }`}
                aria-pressed={active}
                title={m.label}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {mode === "ai" && (
          <div className="flex items-center gap-2">
            <select
              value={aiVariant}
              onChange={(e) => setAiVariant(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-label={t(lang, "ai_select_label")}
            >
              {variants.map((v) => (
                <option key={v.key} value={v.key}>
                  {v.label}
                </option>
              ))}
            </select>

            <select
              value={aiLength}
              onChange={(e) => setAiLength(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-label="Length"
            >
              {Object.entries(lengthPresets).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-zinc-50 p-5 text-center text-lg leading-relaxed text-zinc-900 ring-1 ring-zinc-200">
        {roast}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-zinc-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-800 ring-1 ring-amber-200">
          {formatNumber(sent)} {t(lang, "stat_sent_suffix")}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg active:scale-[.98] disabled:opacity-50"
        >
          {busy ? "..." : t(lang, "btn_generate")}
        </button>

        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg active:scale-[.98]"
        >
          {t(lang, "btn_whatsapp")}
        </button>

        <button
          onClick={handleMessenger}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#00B2FF] px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg active:scale-[.98]"
        >
          Messenger (text)
        </button>

        <button
          onClick={handleFacebook}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#1877F2] px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg active:scale-[.98]"
        >
          Facebook
        </button>

        <button
          onClick={handleTwitter}
          className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg active:scale-[.98]"
        >
          X (Twitter)
        </button>

        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-zinc-800 shadow-md ring-1 ring-zinc-200 hover:shadow-lg active:scale-[.98]"
        >
          Share
        </button>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-zinc-800 shadow-md ring-1 ring-zinc-200 hover:shadow-lg active:scale-[.98]"
        >
          {copied ? t(lang, "btn_copied") : t(lang, "btn_copy")}
        </button>

        <button
          onClick={onSaveImage}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-zinc-800 shadow-md ring-1 ring-zinc-200 hover:shadow-lg active:scale-[.98]"
        >
          {t(lang, "btn_save_img")}
        </button>
      </div>
    </div>
  );
}
