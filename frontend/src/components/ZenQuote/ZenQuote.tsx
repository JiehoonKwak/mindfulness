import { useState } from "react";

const ZEN_QUOTES = [
  { text: "Breathe in calm, breathe out tension.", author: null },
  { text: "The present moment is the only moment available to us.", author: "Thich Nhat Hanh" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "Be where you are, not where you think you should be.", author: null },
  { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { text: "Silence is not empty. It is full of answers.", author: null },
  { text: "Let go of what was. Accept what is. Have faith in what will be.", author: null },
  { text: "Within you, there is a stillness and sanctuary.", author: "Hermann Hesse" },
  { text: "Do not dwell in the past, do not dream of the future.", author: "Buddha" },
  { text: "When you realize nothing is lacking, the whole world belongs to you.", author: "Lao Tzu" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export default function ZenQuote() {
  // Select quote based on day of year for daily rotation
  // Using useState with lazy initializer to compute once on mount
  const [quote] = useState(() => {
    const dayOfYear = getDayOfYear();
    return ZEN_QUOTES[dayOfYear % ZEN_QUOTES.length];
  });

  return (
    <div className="text-center px-6 py-8">
      <p className="text-lg font-light leading-relaxed text-[var(--color-text)] italic">
        "{quote.text}"
      </p>
      {quote.author && (
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          - {quote.author}
        </p>
      )}
    </div>
  );
}
