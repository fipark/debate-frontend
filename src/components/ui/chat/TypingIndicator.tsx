"use client";

import { useEffect, useState } from "react";

const PHRASES = ["답변을 정리하고 있어요…", "근거를 검토하는 중…", "반박 포인트를 구성 중…", "문장을 정리 있어요…"];

export default function TypingIndicator({ name = "AI 토론자" }: { name?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((prev) => (prev + 1) % PHRASES.length), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <span className="text-sm">🤖</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 text-sm font-semibold">{name}</div>
        <div className="w-fit rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">{PHRASES[i]}</div>
      </div>
    </div>
  );
}
