import React from "react";

export default function ShareButtons({
  url,
  text,
  via = "",
  hashtags = "roast,funny",
  className = "",
}) {
  const shareUrl =
    url ||
    (typeof window !== "undefined"
      ? window.location.href
      : "https://dailygenius.app");
  const shareText =
    text || "Roast Daily – glume rapide fără repetiții. Încearcă acum!";

  const openPopup = (u) =>
    window.open(u, "_blank", "noopener,noreferrer,width=600,height=540");

  const shareWhatsApp = () =>
    openPopup(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText} ${shareUrl}`
      )}`
    );

  const shareFacebook = () =>
    openPopup(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`
    );

  const shareTwitter = () =>
    openPopup(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}${
        via ? `&via=${encodeURIComponent(via)}` : ""
      }&hashtags=${encodeURIComponent(hashtags)}`
    );

  const webShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Roast Daily",
          text: shareText,
          url: shareUrl,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert("Link copiat!");
      } catch {
        alert("Nu s-a putut copia. Copiază manual.");
      }
    }
  };

  const btn =
    "px-3 py-2 rounded-xl border text-sm hover:bg-black/5 transition active:scale-[0.98]";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button onClick={webShare} className={btn} aria-label="Share (system)">
        Share
      </button>
      <button
        onClick={shareWhatsApp}
        className={btn}
        aria-label="Share on WhatsApp"
      >
        WhatsApp
      </button>
      <button
        onClick={shareFacebook}
        className={btn}
        aria-label="Share on Facebook"
      >
        Facebook
      </button>
      <button onClick={shareTwitter} className={btn} aria-label="Share on X">
        X (Twitter)
      </button>
    </div>
  );
}
