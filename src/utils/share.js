export const SITE_URL = "https://dailygenius.app"; // schimbă la nevoie

const templates = {
  ro: ({ roast }) =>
    `😂 ${"Am găsit roast-ul perfect pentru tine:"}\n\n${roast}\n\n${
      "Vrei să vezi ce zice și de tine?"
    } 👉 ${SITE_URL}`,
  en: ({ roast }) =>
    `😂 ${"Found the perfect roast for you:"}\n\n${roast}\n\n${
      "Wanna see what it says about you too?"
    } 👉 ${SITE_URL}`,
};

export function buildWhatsAppText(roast, lang = "ro") {
  const msg = (templates[lang] || templates.ro)({ roast });
  return encodeURIComponent(msg);
}

export function openWhatsApp(roast, lang = "ro") {
  const encoded = buildWhatsAppText(roast, lang);
  const url = `https://wa.me/?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}
