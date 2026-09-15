const KNOWLEDGE_BASE = [
  {
    id: "fatture-email",
    title: "Gestione fatture ricevute via email",
    text: "Ricezione email, download allegato, estrazione dati, verifica, registrazione nel gestionale, archiviazione e notifica."
  },
  {
    id: "richieste-ferie",
    title: "Gestione richieste ferie",
    text: "Il dipendente invia la richiesta, il responsabile verifica disponibilità, approva o rifiuta, quindi viene aggiornata la presenza e inviata una conferma."
  },
  {
    id: "report-mensile",
    title: "Report mensile",
    text: "Raccolta dati da più applicativi, controllo dei dati, consolidamento in Excel, generazione del report e invio agli interessati."
  },
  {
    id: "documenti-personale",
    title: "Gestione documenti del personale",
    text: "Ricezione documenti, controllo dei campi obbligatori, rinomina, archiviazione nella cartella corretta e richiesta di integrazioni quando mancano dati."
  }
];

export function retrieveRelevantDocuments(query, limit = 3) {
  const tokens = String(query || "").toLowerCase().split(/[^a-zàèéìòù0-9]+/).filter(t => t.length > 3);
  return KNOWLEDGE_BASE
    .map(doc => ({
      ...doc,
      score: tokens.reduce((score, token) =>
        score + (doc.title.toLowerCase().includes(token) || doc.text.toLowerCase().includes(token) ? 1 : 0), 0)
    }))
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
