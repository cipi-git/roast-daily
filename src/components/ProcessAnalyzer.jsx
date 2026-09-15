import { useState } from "react";

const PROXY_BASE = (import.meta.env.VITE_AI_PROXY_URL || "http://localhost:8787/ai/roast").replace(/\/ai\/roast\/?$/, "");

export default function ProcessAnalyzer({ lang = "it" }) {
  const [process, setProcess] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const labels = lang === "it"
    ? { title: "AI Process Assistant", sub: "Analizza un processo aziendale, recupera conoscenza interna pertinente e propone un workflow di automazione.", placeholder: "Es.: Riceviamo fatture via email, le scarichiamo, controlliamo i dati, li copiamo in Excel e inviamo un report...", button: "Analizza il processo", loading: "Analisi in corso...", error: "Non è stato possibile analizzare il processo.", summary: "Sintesi", opportunities: "Opportunità di automazione", workflow: "Workflow suggerito", risks: "Rischi / attenzioni", next: "Prossimi passi", sources: "Fonti interne recuperate" }
    : { title: "AI Process Assistant", sub: "Analyze a business process, retrieve relevant internal knowledge and suggest an automation workflow.", placeholder: "Example: We receive invoices by email, download them, verify data, copy it into Excel and send a report...", button: "Analyze process", loading: "Analyzing...", error: "Could not analyze the process.", summary: "Summary", opportunities: "Automation opportunities", workflow: "Suggested workflow", risks: "Risks / considerations", next: "Next steps", sources: "Retrieved internal sources" };

  async function analyze() {
    if (!process.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch(`${PROXY_BASE}/ai/process-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ process, lang: "it" })
      });
      if (!response.ok) throw new Error("Request failed");
      setResult(await response.json());
    } catch {
      setError(labels.error);
    } finally { setLoading(false); }
  }

  const List = ({ title, items }) => (
    <div className="rounded-2xl bg-white/10 p-5">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-zinc-200">
        {(items || []).map((item, i) => <li key={i} className="rounded-xl bg-white/5 p-3">{item}</li>)}
      </ul>
    </div>
  );

  return (
    <section className="mx-auto max-w-5xl py-10">
      <div className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">AI • RAG • AUTOMATION</p>
        <h2 className="text-2xl font-extrabold sm:text-3xl">{labels.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">{labels.sub}</p>
        <textarea value={process} onChange={e => setProcess(e.target.value)} rows={5} placeholder={labels.placeholder}
          className="mt-5 w-full rounded-2xl bg-white p-4 text-sm text-zinc-900 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white" />
        <button type="button" onClick={analyze} disabled={loading || !process.trim()}
          className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? labels.loading : labels.button}
        </button>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-white/10 p-5"><h3 className="font-semibold">{labels.summary}</h3><p className="mt-3 text-sm text-zinc-200">{result.summary}</p></div>
            <div className="grid gap-4 md:grid-cols-2"><List title={labels.opportunities} items={result.opportunities}/><List title={labels.workflow} items={result.workflow}/><List title={labels.risks} items={result.risks}/><List title={labels.next} items={result.next_steps}/></div>
            {result.sources?.length > 0 && <div className="rounded-2xl bg-white/10 p-5"><h3 className="font-semibold">{labels.sources}</h3><p className="mt-3 text-sm text-zinc-300">{result.sources.map(s => s.title).join(" • ")}</p></div>}
          </div>
        )}
      </div>
    </section>
  );
}
