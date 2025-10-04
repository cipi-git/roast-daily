// src/ai/generator.js
// AI-like roast generator with compositional templates, synonyms & no-repeat memory.

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const personFallback = (lang) => (lang === "en" ? "your friend" : "prietenul tău");

// Keep recent outputs per (lang|variant) to avoid repeats
const recentMap = new Map();
const MAX_RECENT = 10;
const keyFor = (lang, variant) => `${lang}|${variant}`;

function pushRecent(lang, variant, text) {
  const k = keyFor(lang, variant);
  const list = recentMap.get(k) || [];
  list.unshift(text);
  while (list.length > MAX_RECENT) list.pop();
  recentMap.set(k, list);
}
function isRecent(lang, variant, text) {
  const k = keyFor(lang, variant);
  const list = recentMap.get(k) || [];
  return list.includes(text);
}

// Lightweight lexical mutation
function mutate(text, swaps) {
  let out = text;
  swaps.forEach(([from, alts]) => {
    if (Math.random() < 0.6) {
      const alt = pick(alts);
      const re = new RegExp(`\\b${from}\\b`, "gi");
      out = out.replace(re, alt);
    }
  });
  return out;
}

const bank = {
  ro: {
    // building blocks
    intros: [
      "[name], sincer,",
      "Știi ceva, [name]?",
      "Real vorbind, [name],",
      "Pe bune, [name],",
      "Fără supărare, [name],",
    ],
    observations: {
      light: [
        "pari gata de treabă, dar cred că e doar lumina bună",
        "ai energia unui luni dimineață după vacanță",
        "ai și azi o relație serioasă cu butonul de amânare",
        "te miști cu grația unui progres bar blocat la 99%",
        "ai pornit în forță… spre pauză",
      ],
      medium: [
        "tastatura ta face mai mult zgomot decât livrabilele tale",
        "ai optimizat perfect tot ce ține de amânare",
        "ai multe tab-uri deschise și puține task-uri închise",
        "calendarul urlă, dar [work] e pe silențios",
        "ai pus [work] pe modul avion și ai pierdut și telecomanda",
      ],
      savage: [
        "ești dovada vie că evoluția are buton de rewind",
        "când zici «lucrez», pare că doar deschizi laptopul și lași gravitația să muncească",
        "ai carismă cât un fax stricat, dar hey, retro e la modă",
        "ai redefinit ‘deadline’: ai murit tu, nu el",
        "ai sprinturi în care alergi doar după scuze",
      ],
      smart: [
        "ai talentul bine țintit de a ține 20 de tab-uri deschise și zero rezultate",
        "browserul merge, dar [work] parcă nu prinde semnal",
        "agenda are alarme, însă [work] e pe Do Not Disturb",
        "ai un throughput selectiv: doar pe pauze",
        "ai workflow-ul unei pisici la soare: impecabil de lent",
      ],
      lightAI: [
        "dacă ai fi aplicație, ai fi mereu pe sleep mode",
        "ai vibe de stand-by premium",
        "pare că rulezi în background cu 2% CPU",
        "ai licență full pe amânare, trial pe acțiune",
      ],
      mediumAI: [
        "ai setat [work] pe throttling sever",
        "ai un build mereu la 99% și niciodată ‘done’",
        "ești compatibil doar cu shortcut-ul de snooze",
        "ai optimizat latența la decizie, nu și rezultatul",
      ],
      savageAI: [
        "ai un benchmark sub nivelul modemului dial-up",
        "dacă ar exista KPI la scuze, ai fi unicorn",
        "ai latency emoțional și jitter profesional",
        "ai făcut out-source la motivație către nimeni",
      ],
      personalAI: [
        "dacă motivația te-ar căuta, te-ar lăsa pe seen",
        "ambitia ta e pe silent și cred că ai uitat pinul",
        "checklist-ul tău are un singur item: «amân până mâine»",
        "ai dat snooze la viață cu repeat",
      ],
    },
    pivots: [
      "—",
      "…",
      " și ",
      ", dar ",
      "; totuși ",
    ],
    punches: [
      "hai, fă un task mic și promitem că râdem mai puțin",
      "dă un ship mic — orice — și după mai glumim",
      "apasă «Save progress», nu doar «Save face»",
      "apasă «Start» înainte să mai apăsăm noi «Roast»",
      "hai cu un micro-pas: 5 minute și gata",
    ],
    closers: [
      "Zic cu drag, nu cu ciocanul.",
      "Prietenos, dar onest.",
      "Fără supărare — râdem și muncim.",
      "Ok, unul mic acum și gata.",
    ],
    verbs: ["rulezi", "funcționezi", "te miști"],
    work: ["productivitate", "deadline", "motivație", "to-do"],
    swaps: [
      ["task", ["sarcină", "treabă", "punct"]],
      ["pauză", ["break", "respiro", "pauzică"]],
      ["amânare", ["snooze", "delay", "întârziere fină"]],
    ],
  },

  en: {
    intros: [
      "[name], honestly,",
      "Real talk, [name],",
      "No offense, [name],",
      "Be honest with yourself, [name],",
      "Let’s face it, [name],",
    ],
    observations: {
      light: [
        "you look ready to work, but that’s just good lighting",
        "you’ve got a premium subscription to ‘later’",
        "you move with the elegance of a 99% progress bar",
        "today’s energy screams ‘break first, tasks later’",
        "you boot fast… straight into standby",
      ],
      medium: [
        "your keyboard is louder than your shipping rate",
        "you’ve optimized procrastination to production-level",
        "so many tabs open, so few tasks closed",
        "your calendar screams, but [work] is on silent",
        "you put [work] on airplane mode and lost the phone",
      ],
      savage: [
        "you’re living proof evolution has a rewind button",
        "when you say “working”, you just open the laptop and let gravity do the rest",
        "you’ve got the charisma of a broken fax — vintage, not valuable",
        "you redefined ‘deadline’: it died, you didn’t",
        "your sprint is just a jog towards excuses",
      ],
      smart: [
        "you’ve mastered the art of 20 tabs open, 0 outcomes",
        "the browser runs; your [work] doesn’t get signal",
        "your calendar has alarms, your [work] is on Do Not Disturb",
        "selective throughput: only on breaks",
        "workflow like a cat in the sun: impeccably slow",
      ],
      lightAI: [
        "if you were an app, you’d default to sleep mode",
        "running in background at 2% CPU is still running, I guess",
        "full license for delay, trial for action",
        "standby looks great on you — not on your tasks",
      ],
      mediumAI: [
        "you throttled [work] to single digits",
        "build’s always at 99% — never ‘done’",
        "compatible only with the snooze shortcut",
        "optimized decision latency, not outcomes",
      ],
      savageAI: [
        "your benchmark is below dial-up standards",
        "if excuses were a KPI, you’d be a unicorn",
        "high emotional latency, professional jitter",
        "you outsourced motivation to no one",
      ],
      personalAI: [
        "if motivation looked for you, it would leave you on read",
        "ambition’s on silent and you forgot the pin",
        "your checklist has one item: “postpone till tomorrow”",
        "life’s on snooze with daily repeat",
      ],
    },
    pivots: ["—", "…", " and ", ", but ", "; still "],
    punches: [
      "ship one tiny thing, then we can laugh again",
      "press ‘Start’ before we press ‘Roast’",
      "hit ‘Save progress’, not just ‘Save face’",
      "five focused minutes — go",
      "one micro-task now, future you will clap",
    ],
    closers: [
      "Said with a smile.",
      "Friendly roast, no malice.",
      "We tease because we care.",
      "Deal? One tiny step now.",
    ],
    verbs: ["run", "operate", "move"],
    work: ["productivity", "deadline", "motivation", "to-do list"],
    swaps: [
      ["task", ["item", "thing", "ticket"]],
      ["break", ["pause", "breather", "timeout"]],
      ["delay", ["stall", "postpone", "lag"]],
    ],
  },
};

// Map variants to composition pools
const variantMap = {
  ro: {
    light: (L) => [L.observations.light],
    medium: (L) => [L.observations.medium],
    savage: (L) => [L.observations.savage],
    smart: (L) => [L.observations.smart],
    lightAI: (L) => [L.observations.lightAI],
    mediumAI: (L) => [L.observations.mediumAI],
    savageAI: (L) => [L.observations.savageAI],
    personal: (L) => [L.observations.personalAI],
  },
  en: {
    light: (L) => [L.observations.light],
    medium: (L) => [L.observations.medium],
    savage: (L) => [L.observations.savage],
    smart: (L) => [L.observations.smart],
    lightAI: (L) => [L.observations.lightAI],
    mediumAI: (L) => [L.observations.mediumAI],
    savageAI: (L) => [L.observations.savageAI],
    personal: (L) => [L.observations.personalAI],
  },
};

function composeRoast({ L, name, variant }) {
  const pools = (variantMap[L === bank.ro ? "ro" : "en"][variant] || variantMap[
    L === bank.ro ? "ro" : "en"
  ].smart)(L);

  // Build: intro + observation + optional pivot+observation + punch + closer (30% chance)
  const intro = pick(L.intros)
    .replace(/\[name\]/g, name)
    .replace(/\[verb\]/g, pick(L.verbs));

  // At least one observation, maybe two
  const obs1 = pick(pools[0]).replace(/\[work\]/g, pick(L.work));
  const second = Math.random() < 0.35 ? `${pick(L.pivots)} ${pick(pools[0]).replace(/\[work\]/g, pick(L.work))}` : "";

  const punch = pick(L.punches);
  const closer = Math.random() < 0.35 ? ` ${pick(L.closers)}` : "";

  let text = `${intro} ${obs1}${second ? " " + second : ""}; ${punch}.${closer}`;
  text = mutate(text, L.swaps);
  return cap(text);
}

export function generateAIRoast({
  lang = "ro",
  variant = "smart",
  friendName = "",
  seed = "",
}) {
  const L = bank[lang] || bank.ro;
  const safeVariant = variant in (variantMap[lang] || {}) ? variant : "smart";
  const name =
    (friendName || "").trim() ||
    (seed && /\[friend\]/.test(seed) ? personFallback(lang) : personFallback(lang));

  // try several times to avoid recent duplicates
  for (let i = 0; i < 8; i++) {
    const candidate = composeRoast({ L, name, variant: safeVariant });
    if (!isRecent(lang, safeVariant, candidate)) {
      pushRecent(lang, safeVariant, candidate);
      return candidate;
    }
  }
  // As a fallback, return last try
  const fallback = composeRoast({ L, name, variant: safeVariant });
  pushRecent(lang, safeVariant, fallback);
  return fallback;
}
