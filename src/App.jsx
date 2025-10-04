import { useState } from "react";
import RoastCard from "./components/RoastCard";
import { roastData } from "./data/roastData.js";
import { t, LANGS } from "./i18n.js";
import { generateAIRoast } from "./ai/generator.js";

export default function App() {
  const [lang, setLang] = useState("ro");

  const onGenerateRoast = (mode = "light") => {
    const arr = roastData[lang][mode] || roastData[lang].light;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // primește {variant, friendName, seed}
  const onGenerateAIRoast = ({ variant, friendName, seed }) =>
    generateAIRoast({ lang, variant, friendName, seed });

  const onSaveImage = () => alert("Export image: coming soon!");

  return (
    <main className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-white via-rose-50 to-amber-50 px-4">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white"
          >
            🪶
          </span>
          <div className="leading-tight">
            <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">
              Roast Daily
            </h1>
            <p className="text-xs text-zinc-500">{t(lang, "brand_by")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-white/80 px-1 py-1 ring-1 ring-zinc-200">
            {LANGS.map((L) => {
              const active = lang === L;
              return (
                <button
                  key={L}
                  onClick={() => setLang(L)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    active
                      ? "bg-black text-white"
                      : "text-zinc-700 hover:bg-white"
                  }`}
                  aria-pressed={active}
                >
                  {L.toUpperCase()}
                </button>
              );
            })}
          </div>
          <a
            href="https://buymeacoffee.com/cipicip7q"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-md hover:bg-yellow-300 active:scale-[.97]"
          >
            ☕ Buy me a coffee
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl py-4 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
          {t(lang, "hero_title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-zinc-600">
          {t(lang, "hero_sub")}
        </p>
      </section>

      {/* Main Card */}
      <section className="mx-auto max-w-3xl py-4">
        <RoastCard
          lang={lang}
          initialRoast={t(lang, "initial_roast")}
          onGenerateRoast={onGenerateRoast}
          onGenerateAIRoast={onGenerateAIRoast}
          onSaveImage={onSaveImage}
        />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: t(lang, "feature_whatsapp_title"),
              desc: t(lang, "feature_whatsapp_desc"),
            },
            {
              title: t(lang, "feature_modes_title"),
              desc: t(lang, "feature_modes_desc"),
            },
            {
              title: t(lang, "feature_ai_title"),
              desc: t(lang, "feature_ai_desc"),
            },
            {
              title: t(lang, "feature_fav_title"),
              desc: t(lang, "feature_fav_desc"),
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200"
            >
              <h3 className="font-semibold text-zinc-900">{f.title}</h3>
              <p className="text-sm text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} dailygenius.app · {t(lang, "footer")}
      </footer>
    </main>
  );
}
