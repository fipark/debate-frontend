"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Send, User } from "lucide-react";
import { getTopicById } from "@/dumidata/topics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DebateResult, formatTime, Message } from "@/lib/chat/chat";
import ChatRow from "@/components/ui/chat/ChatRow";
import ResultDialog from "@/components/ui/chat/ResultDialog";
import LiveScoreCard, { type LiveScore } from "@/components/ui/chat/LiveScoreCard";
import { wordStream } from "@/components/ui/chat/wordStream";

export default function DebateChatPage() {
  //라이브 스코어 카드
  const [isPending, startTransition] = useTransition();
  const [liveScore, setLiveScore] = useState<LiveScore>({
    total: 0,
    logic: 0,
    evidence: 0,
    persuasion: 0,
    updatedAt: formatTime(),
  });

  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;

  const searchParams = useSearchParams();
  const side = (searchParams.get("side") ?? "pro") as "pro" | "con";

  const topic = useMemo(() => getTopicById(topicId), [topicId]);
  const topicTitle = topic?.title ?? topicId;

  const userName = "준환 박";
  const userInitials = "아";
  // 메세지
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "m0",
      role: "assistant",
      kind: "intro",
      content:
        `반갑습니다. 저는 "${side === "pro" ? "반대" : "찬성"}" 입장에서 토론을 진행하겠습니다.\n\n` +
        `토론 주제: ${topicTitle}\n\n` +
        `당신의 주장을 논리적으로 펼쳐보세요. (근거/반박/설득력을 중심으로 평가됩니다.)`,
      time: formatTime(),
    },
  ]);
  //결과 모달창
  const [resultOpen, setResultOpen] = useState(false);
  const [result, setResult] = useState<DebateResult | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const canSend = input.trim().length > 0;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      time: formatTime(),
      status: "done",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    //  AI placeholder (생각 중)
    const aiId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: aiId, role: "assistant", content: "", time: formatTime(), status: "streaming" },
    ]);

    try {
      //  나중에 여길 fetch로 교체
      // const res = await fetch("...", ...)
      // const data = await res.json()
      // const full = data.reply

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      //  응답 시간 설정 느리게
      await sleep(10000); // 5초

      const full =
        "모든 국민은 인간으로서의 존엄과 가치를 가지며, 행복을 추구할 권리를 가진다. 국가는 개인이 가지는 불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다. 모든 국민은 자기의 행위가 아닌 친족의 행위로 인하여 불이익한 처우를 받지 아니한다. 헌법재판소 재판관은 탄핵 또는 금고 이상의 형의 선고에 의하지 아니하고는 파면되지 아니한다";

      await wordStream(full, (current) => {
        setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, content: current } : m)));
      });
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content: "응답을 받는 데 실패했어요. 다시 시도해볼까요?", status: "done" } : m
        )
      );
    }
  };

  function mockEvaluate(messagesText: string) {
    /*******************************************************임시 규칙: 글자수/문장부호/키워드로 대충 점수 만듬 (UI 확인용)*****************************************************************/
    const len = messagesText.length;

    const logic = Math.min(100, Math.floor(len / 40));
    const evidence = Math.min(100, Math.floor((messagesText.match(/\d+|근거|자료|통계|연구/g)?.length ?? 0) * 12));
    const persuasion = Math.min(
      100,
      Math.floor((messagesText.match(/따라서|즉|결론|왜냐하면|그러므로/g)?.length ?? 0) * 15)
    );

    const total = Math.min(100, Math.floor((logic + evidence + persuasion) / 3));

    return { total, logic, evidence, persuasion };
  }
  useEffect(() => {
    const userTexts = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n");

    if (!userTexts.trim()) return;

    const t = setTimeout(() => {
      const s = mockEvaluate(userTexts);

      //  transition으로 점수 업데이트
      startTransition(() => {
        setLiveScore({ ...s, updatedAt: formatTime() });
      });
    }, 350);

    return () => clearTimeout(t);
  }, [messages, startTransition]);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href={`/debate/${topicId}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 font-semibold">AI 토론</div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              className="rounded-full px-5"
              onClick={() => {
                setResult({
                  total: liveScore.total,
                  logic: liveScore.logic,
                  evidence: liveScore.evidence,
                  persuasion: liveScore.persuasion,
                  feedback: makeFeedback(liveScore),
                });
                setResultOpen(true);
              }}
            >
              토론 종료
            </Button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* 왼쪽: 채팅 */}
            <Card className="rounded-2xl border overflow-hidden">
              <div className="h-140 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {messages.map((m) => (
                    <ChatRow key={m.id} msg={m} userName={userName} userInitials={userInitials} />
                  ))}
                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="border-t bg-background p-4">
                <div className="flex items-center gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="당신의 주장을 입력하세요…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="h-12 rounded-xl"
                  />
                  <Button onClick={sendMessage} disabled={!canSend} size="icon" className="h-12 w-12 rounded-xl">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* 오른쪽: 실시간 점수 */}
            <div className="lg:sticky lg:top-20 h-fit">
              <LiveScoreCard score={liveScore} loading={isPending} />
            </div>
          </div>
        </div>
      </main>

      {/* 결과 모달 */}
      <ResultDialog
        open={resultOpen}
        onOpenChange={setResultOpen}
        result={result}
        onNewDebate={() => {
          setResultOpen(false);
          window.location.href = "/debate";
        }}
        onGoLeaderboard={() => {
          setResultOpen(false);
          window.location.href = "/leaderboard";
        }}
      />
    </div>
  );

  //*************************************임시 피드백 함수**************************************************************** */
  function makeFeedback(score: { total: number; logic: number; evidence: number; persuasion: number }) {
    const lines: string[] = [];

    if (score.logic < 40) lines.push("논리 흐름이 조금 더 명확하면 좋아요. 주장 → 근거 → 결론 순서로 정리해보세요.");
    else if (score.logic < 70) lines.push("논리 구조가 꽤 좋아요. 반박 대비(예상 반론)까지 넣으면 더 강해져요.");
    else lines.push("논리 전개가 매우 탄탄합니다. 핵심 주장과 결론이 분명해요.");

    if (score.evidence < 40)
      lines.push("근거가 부족해 보여요. 통계/사례/자료 출처를 1~2개만 추가해도 점수가 확 오릅니다.");
    else if (score.evidence < 70) lines.push("근거 제시가 괜찮습니다. 수치나 구체 사례를 하나 더 넣어보세요.");
    else lines.push("근거가 충분하고 구체적입니다. 출처를 명시하면 더 신뢰도가 올라가요.");

    if (score.persuasion < 40)
      lines.push("설득력을 위해 결론 문장을 강하게 마무리해보세요. (예: 따라서 ~해야 합니다.)");
    else if (score.persuasion < 70)
      lines.push("설득력이 좋아요. 반대측 우려를 인정하고 해결책을 제시하면 더 강해집니다.");
    else lines.push("설득력이 매우 뛰어납니다. 반론 선제 대응이 잘 되어 있어요.");

    lines.push("");
    lines.push(`총평: 현재 총점은 ${score.total}점입니다. 다음 메시지에서 가장 약한 항목을 집중 보완해보세요.`);

    return lines.join("\n");
  }
}
