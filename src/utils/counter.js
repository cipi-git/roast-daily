const KEY = "roast_count";

export function getRoastCount() {
  const v = Number(localStorage.getItem(KEY) || "0");
  return Number.isFinite(v) ? v : 0;
}

export function bumpRoastCount(step = 1) {
  const next = getRoastCount() + step;
  localStorage.setItem(KEY, String(next));
  return next;
}

export function formatNumber(n) {
  try {
    return new Intl.NumberFormat("ro-RO").format(n);
  } catch {
    return String(n);
  }
}
