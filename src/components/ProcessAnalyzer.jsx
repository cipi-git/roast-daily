import { useState } from "react";

export default function ProcessAnalyzer({ lang = "en" }) {
  const [process, setProcess] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const labels = lang === "ro"
    ? { title: "AI Process Analyzer", sub: "Descrie un proces repetitiv și AI identifică pașii care pot fi optimizați.", placeholder: "Ex.: Primim facturi pe email, le descarcăm, verificăm datele, copiem valorile în Excel și trimitem un raport...", button: "Analizează procesul", loading: "Analizez...", error: "Nu am putut analiza procesul.", opportunities: "Oportunități", automation: "Automatizare propusă", impact: "Impact estimat" }
    : { title: "AI Process Analyzer", sub: "Describe a repetitive process and AI will identify optimization opportunities.", placeholder: "Example: We receive invoices by email, download them, verify the data, copy values into Excel and send a report...", button: "Analyze process", loading: "Analyzing...", error: "Could not analyze the process.", opportunities: "Opportunities", automation: "Suggested automation", impact: "Estimated impact" };

  async function analyze() {
    if (!process.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/ai/analyze-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ process, lang }),
      });
      if (!response.ok) throw new Error("Request failed");
      setResult(await response.json());
    } catch {
      setError(labels.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl py-10">
      <div className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <div className="mb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">AI + Automation</p>
          <h2 className="text-2xl font-extrabold sm:text-3xl">{labels.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">{labels.sub}</p>
        </div>

        <textarea
          value={process}
          onChange={(e) => setProcess(e.target.value)}
          rows={5}
          placeholder={labels.placeholder}
          className="w-full rounded-2xl bg-white p-4 text-sm text-zinc-900 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white"
        />

        <button
          type="button"
          onClick={analyze}
          disabled={loading || !process.trim()}
          className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? labels.loading : labels.button}
        </button>

        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

        {result && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5 md:col-span-2">
              <h3 className="font-semibold">{labels.opportunities}</h3>
              <ul className="mt-3 space-y-3 text-sm text-zinc-200">
                {(result.opportunities || []).map((item, index) => (
                  <li key={index} className="rounded-xl bg-white/5 p-3">{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <h3 className="font-semibold">{labels.automation}</h3>
              <p className="mt-3 text-sm text-zinc-200">{result.automation || "—"}</p>
              <h3 className="mt-5 font-semibold">{labels.impact}</h3>
              <p className="mt-3 text-sm text-zinc-200">{result.impact || "—"}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
