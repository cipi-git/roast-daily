import React, { useEffect, useState } from "react";

export default function VisitorCounter({
  namespace = "dailygenius.app",
  key = "total_visits",
  className = "",
  label = "Vizite totale",
}) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.countapi.xyz/hit/${encodeURIComponent(
            namespace
          )}/${encodeURIComponent(key)}`
        );
        const data = await res.json();
        if (!cancelled && typeof data?.value === "number") {
          setCount(data.value);
          localStorage.setItem(`vc_${namespace}_${key}`, String(data.value));
        } else {
          throw new Error();
        }
      } catch {
        const local = localStorage.getItem(`vc_${namespace}_${key}`);
        if (!cancelled) setCount(local ? Number(local) : null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [namespace, key]);

  return (
    <div
      className={`inline-flex items-center gap-2 text-xs opacity-80 ${className}`}
      title={label}
      aria-live="polite"
    >
      <span>{label}:</span>
      <span className="font-semibold tabular-nums">
        {loading ? "…" : count ?? "–"}
      </span>
    </div>
  );
}
