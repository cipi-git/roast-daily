import { useState } from "react";
import RoastCard from "./components/RoastCard";
import { roastData } from "./data/roastData.js";
import { t, LANGS } from "./i18n.js";
import { generateAIRoast } from "./ai/generator.js";
import VisitorCounter from "./components/VisitorCounter";

const lsGet = (k, d) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
};
const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export default function App() {
  const [lang, setLang] = useState("ro");

  const pickUnique = (arr, key) => {
    const seenKey = `rd_seen_${key}`;
    const seen = new Set(lsGet(seenKey, []));
    if (seen.size >= arr.length) {
      lsSet(seenKey, []);
      seen.clear();
    }
    let idx = Math.floor(Math.random() * arr.length);
    let guard = 0;
    while (seen.has(idx) && guard < 200) {
      idx = Math.floor(Math.random() * arr.length);
      guard++;
    }
    seen.add(idx);
    lsSet(seenKey, Array.from(seen));
    return arr[idx];
  };

  const onGenerateRoast = (mode = "light") => {
    const bucket = roastData?.[lang]?.[mode] || roastData?.[lang]?.light || [];
    const key = `${lang}_${mode}`;
    if (!bucket.length) return "";
    return pickUnique(bucket, key);
  };

  const onGenerateAIRoast = async ({ variant, friendName, seed }) => {
    const raw = await generateAIRoast({ lang, variant, friendName, seed });
    const key = `rd_ai_recent_${lang}`;
    const recent = lsGet(key, []);
    const exists = recent.includes(raw);
    if (!exists) {
      const next = [raw, ...recent].slice(0, 20);
      lsSet(key, next);
      return raw;
    }
    // dacă s-a repetat exact, mai cerem o dată (o singură încercare)
    const retry = await generateAIRoast({
      lang,
      variant,
      friendName,
      seed: raw,
    });
    const next = [retry, ...recent].slice(0, 20);
    lsSet(key, next);
    return retry;
  };

  const onSaveImage = () => alert("Export image: coming soon!");

  return (
    <main className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-white via-rose-50 to-amber-50 px-4">
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

      <section className="mx-auto max-w-3xl py-4 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
          {t(lang, "hero_title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-zinc-600">
          {t(lang, "hero_sub")}
        </p>
      </section>

      <section className="mx-auto max-w-3xl py-4">
        <RoastCard
          lang={lang}
          initialRoast={t(lang, "initial_roast")}
          onGenerateRoast={onGenerateRoast}
          onGenerateAIRoast={onGenerateAIRoast}
          onSaveImage={onSaveImage}
        />
      </section>

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

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-zinc-200 py-8 text-sm text-zinc-500">
        <span>
          © {new Date().getFullYear()} dailygenius.app · {t(lang, "footer")}
        </span>
        <VisitorCounter
          namespace="dailygenius.app"
          counterKey="total_visits"
          label="Vizite totale"
        />
      </footer>
    </main>
  );
}
