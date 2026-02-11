"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Send, User, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DebateResult, formatTime, Message } from "@/lib/chat/chat";
import ChatRow from "@/components/ui/chat/ChatRow";
import ResultDialog from "@/components/ui/chat/ResultDialog";
import LiveScoreCard, { type LiveScore } from "@/components/ui/chat/LiveScoreCard";

//  토픽도 더미(getTopicById) 대신 API로 가져오고 싶으면 아래처럼
import type { TopicApi } from "@/dumidata/topics";
import { getCurrentUser, getInitials } from "@/lib/auth";

type ApiMsg = {
  id: number;
  role: "USER" | "OPPONENT_AI" | "MODERATOR_AI";
  content: string;
  createdAt: string;
};

export default function DebateChatPage() {
  const [isPending, startTransition] = useTransition();
  const [liveScore, setLiveScore] = useState<LiveScore>({
    total: 0,
    logic: 0,
    evidence: 0,
    persuasion: 0,
    updatedAt: formatTime(),
  });
  const currentUser = getCurrentUser();
  const userName = currentUser?.name ?? currentUser?.email ?? "사용자";
  const userInitials = getInitials(currentUser?.name ?? currentUser?.email);

  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;

  const searchParams = useSearchParams();
  const side = (searchParams.get("side") ?? "pro") as "pro" | "con";
  const sessionId = searchParams.get("sessionId");
  const [ending, setEnding] = useState(false);

  const [topic, setTopic] = useState<TopicApi | null>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [sending, setSending] = useState(false);

  const [resultOpen, setResultOpen] = useState(false);
  const [result, setResult] = useState<DebateResult | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const canSend = input.trim().length > 0 && !sending;

  //  메시지 매핑: 백 role -> 프론트 role
  function mapApiMsg(m: ApiMsg): Message {
    const role: Message["role"] = m.role === "USER" ? "user" : m.role === "MODERATOR_AI" ? "moderator" : "assistant";

    return {
      id: String(m.id),
      role,
      content: m.content,
      time: formatTime(new Date(m.createdAt)),
      status: "done",
    };
  }

  //  초기 로드: 토픽 + 메시지 히스토리
  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        if (!sessionId) {
          // sessionId 없으면 chat이 성립이 안 됨
          if (alive) {
            setMessages([
              {
                id: "no-session",
                role: "moderator",
                content: "세션 정보가 없어요. 토론 준비 화면에서 다시 시작해주세요.",
                time: formatTime(),
                status: "done",
              },
            ]);
          }
          return;
        }

        setLoadingInit(true);

        const accessToken = localStorage.getItem("accessToken") ?? "";

        // 토픽 로드(더미 제거용)
        const topicRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/topics/${topicId}`);
        if (topicRes.ok) {
          const t = (await topicRes.json()) as TopicApi;
          if (alive) setTopic(t);
        }

        // 메시지 로드
        const msgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debates/${sessionId}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!msgRes.ok) throw new Error("failed to load messages");
        const apiMsgs = (await msgRes.json()) as ApiMsg[];

        if (!alive) return;

        if (apiMsgs.length === 0) {
          // 첫 입장 인트로(사회자/상대 입장 안내는 프론트에서 한 번만 보여줘도 됨)
          const topicTitle = tTitle();
          setMessages([
            {
              id: "intro",
              role: "moderator",
              kind: "intro",
              content:
                `사회자: 토론을 시작합니다.\n\n` +
                `토론 주제: ${topicTitle}\n` +
                `당신의 입장: ${side === "pro" ? "찬성(PRO)" : "반대(CON)"}\n\n` +
                `근거/논리/설득력을 중심으로 진행해 주세요.`,
              time: formatTime(),
              status: "done",
            },
          ]);
        } else {
          setMessages(apiMsgs.map(mapApiMsg));
        }
      } catch {
        if (alive) {
          setMessages([
            {
              id: "load-fail",
              role: "moderator",
              content: "메시지를 불러오지 못했어요. 토큰/세션을 확인해주세요.",
              time: formatTime(),
              status: "done",
            },
          ]);
        }
      } finally {
        if (alive) setLoadingInit(false);
      }
    }

    run();
    return () => {
      alive = false;
    };

    function tTitle() {
      return topic?.title ?? `#${topicId}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, sessionId]); // topic은 여기 dependency에 넣으면 formatTime/tTitle 이슈 생겨서 위처럼 처리

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !sessionId) return;

    try {
      setSending(true);
      setInput("");

      const accessToken = localStorage.getItem("accessToken") ?? "";

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debates/${sessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) throw new Error("send failed");

      const data = (await res.json()) as {
        userMsg: ApiMsg;
        moderatorMsg: ApiMsg;
        opponentMsg: ApiMsg;
      };

      //  백에서 받은 3개 메시지를 그대로 append
      setMessages((prev) => [
        ...prev,
        mapApiMsg(data.userMsg),
        mapApiMsg(data.moderatorMsg),
        mapApiMsg(data.opponentMsg),
      ]);
    } catch {
      // 실패 메시지는 사회자 스타일로
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "moderator",
          content: "전송에 실패했어요. 토큰/네트워크를 확인하고 다시 시도해주세요.",
          time: formatTime(),
          status: "done",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // 점수 계산은 기존 로직 그대로 유지 (user 메시지만 기준)
  function mockEvaluate(messagesText: string) {
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
      startTransition(() => setLiveScore({ ...s, updatedAt: formatTime() }));
    }, 350);

    return () => clearTimeout(t);
  }, [messages, startTransition]);

  if (loadingInit) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-lg font-semibold">대화를 불러오는 중…</p>
      </div>
    );
  }
  async function endDebate() {
    if (!sessionId) return;

    try {
      setEnding(true);

      const accessToken = localStorage.getItem("accessToken") ?? "";

      // ✅ 지금은 프론트 점수 계산(mockEvaluate) 결과를 서버에 저장하는 버전
      const body = {
        totalScore: liveScore.total,
        logicScore: liveScore.logic,
        evidenceScore: liveScore.evidence,
        persuasionScore: liveScore.persuasion,
        feedback: makeFeedback(liveScore),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debates/${sessionId}/end`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("end failed");

      // 백엔드가 ended session을 반환한다고 가정
      const data = (await res.json()) as {
        totalScore: number | null;
        logicScore: number | null;
        evidenceScore: number | null;
        persuasionScore: number | null;
        feedback: string | null;
      };

      setResult({
        total: data.totalScore ?? body.totalScore,
        logic: data.logicScore ?? body.logicScore,
        evidence: data.evidenceScore ?? body.evidenceScore,
        persuasion: data.persuasionScore ?? body.persuasionScore,
        feedback: data.feedback ?? body.feedback,
      });
      setResultOpen(true);
    } catch {
      // 실패했어도 모달은 띄워주되, 저장 실패 안내만 추가
      const fallbackFeedback =
        makeFeedback(liveScore) + "\n\n(⚠️ 결과 저장에 실패했어요. 네트워크/토큰을 확인해주세요.)";
      setResult({
        total: liveScore.total,
        logic: liveScore.logic,
        evidence: liveScore.evidence,
        persuasion: liveScore.persuasion,
        feedback: fallbackFeedback,
      });
      setResultOpen(true);
    } finally {
      setEnding(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
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
              onClick={endDebate}
              disabled={ending || !sessionId}
            >
              {ending ? "종료 중..." : "토론 종료"}
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
            <Card className="rounded-2xl border overflow-hidden">
              <div className="h-140 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {messages.map((m) =>
                    m.role === "moderator" ? (
                      //  사회자 UI(센터 정렬 시스템 메시지)
                      <div key={m.id} className="flex justify-center">
                        <div className="max-w-[85%] rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-foreground">
                            <ShieldCheck className="h-4 w-4" />
                            사회자
                          </div>
                          <pre className="whitespace-pre-wrap leading-6">{m.content}</pre>
                        </div>
                      </div>
                    ) : (
                      <ChatRow key={m.id} msg={m} userName={userName} userInitials={userInitials} />
                    )
                  )}
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
                    disabled={sending}
                  />
                  <Button onClick={sendMessage} disabled={!canSend} size="icon" className="h-12 w-12 rounded-xl">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>

            <div className="lg:sticky lg:top-20 h-fit">
              <LiveScoreCard score={liveScore} loading={isPending} />
            </div>
          </div>
        </div>
      </main>

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
