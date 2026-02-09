"use client";

import { Message } from "@/lib/chat/chat";
import TypingIndicator from "@/components/ui/chat/TypingIndicator";

export default function ChatRow({
  msg,
  userName,
  userInitials,
}: {
  msg: Message;
  userName: string;
  userInitials: string;
}) {
  // 첫 안내(인트로) 카드(중앙)
  if (msg.kind === "intro") {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-180 rounded-2xl bg-muted/50 px-6 py-6 text-center">
          <p className="whitespace-pre-wrap wrap-break-words text-sm leading-6 text-foreground">{msg.content}</p>
          <div className="mt-4 text-left text-xs text-muted-foreground">{msg.time}</div>
        </div>
      </div>
    );
  }

  const isAI = msg.role === "assistant";

  if (isAI) {
    if (!msg.content && msg.status === "streaming") {
      return <TypingIndicator name="AI 토론자" />;
    }
    return (
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <span className="text-sm">🤖</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 text-sm font-semibold">AI 토론자</div>
          <div className="w-fit max-w-180 rounded-2xl bg-muted px-4 py-3 text-sm leading-6 text-foreground wrap-break-words whitespace-pre-wrap">
            {msg.content}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{msg.time}</div>
        </div>
      </div>
    );
  }

  // USER
  return (
    <div className="flex items-start justify-end gap-3">
      <div className="min-w-0 max-w-180 text-right">
        <div className="mb-1 text-sm font-semibold">{userName}</div>
        <div className="ml-auto w-fit rounded-2xl bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground wrap-break-words whitespace-pre-wrap">
          {msg.content}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{msg.time}</div>
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <span className="text-sm font-bold">{userInitials}</span>
      </div>
    </div>
  );
}
