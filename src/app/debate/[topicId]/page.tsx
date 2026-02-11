"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ArrowLeft, ThumbsDown, ThumbsUp, ShieldCheck, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { levelBadgeVariant, levelLabel, TopicApi } from "@/dumidata/topics";

type Side = "pro" | "con";

export default function DebateSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const topicId = params.topicId as string; // route param

  // URL로도 초기값 줄 수 있게 (?side=pro)
  const initialSide = (searchParams.get("side") as Side) || null;

  const [side, setSide] = useState<Side | null>(initialSide);
  const [topic, setTopic] = useState<TopicApi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/topics/${topicId}`);
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as TopicApi;
        if (alive) setTopic(data);
      } catch {
        if (alive) setTopic(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [topicId]);

  const start = async () => {
    if (!side) return;

    const userStance = side === "pro" ? "PRO" : "CON";

    try {
      // 필요하면 로딩 상태 추가해도 됨
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify({
          topicId: Number(topicId), // topicId가 숫자 라우트면 Number로
          userStance,
        }),
      });

      if (!res.ok) throw new Error("create session failed");
      const session = (await res.json()) as { id: number };

      router.push(`/debate/${topicId}/chat?side=${side}&sessionId=${session.id}`);
    } catch {
      alert("토론 세션 생성 실패");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-lg font-semibold">주제를 불러오는 중…</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-lg font-semibold">주제를 찾을 수 없어요.</p>
        <Button asChild className="mt-4">
          <Link href="/debate">주제 목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/debate">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <span className="font-semibold">토론 준비</span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/leaderboard">
                <Trophy className="h-4 w-4" />
                나의 점수
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/profile">내 프로필</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">찬성 / 반대를 선택하세요</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground md:text-base">
            선택한 입장에서 AI와 토론을 진행합니다
          </p>

          <Separator className="my-10" />

          {/* Topic Card */}
          <Card className="rounded-2xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {topic.category}
                </Badge>
                <Badge variant={levelBadgeVariant(topic.level)} className="rounded-full">
                  {levelLabel(topic.level)}
                </Badge>
              </div>
              <CardTitle className="text-xl leading-7">{topic.title}</CardTitle>
              <CardDescription className="leading-6">{topic.description ?? ""}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-start gap-2 rounded-xl border p-4 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4" />
                <div className="leading-6">
                  토론은 <b className="text-foreground">근거 제시</b>와 <b className="text-foreground">논리 전개</b>를
                  중심으로 평가돼요. 감정적 비난/비속어는 감점될 수 있어요.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side Select */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <SelectCard
              selected={side === "pro"}
              title="찬성"
              desc="주장에 동의하는 입장에서 논거를 강화하세요."
              icon={<ThumbsUp className="h-5 w-5" />}
              onClick={() => setSide("pro")}
            />
            <SelectCard
              selected={side === "con"}
              title="반대"
              desc="주장에 반대하는 입장에서 반박 논리를 구축하세요."
              icon={<ThumbsDown className="h-5 w-5" />}
              onClick={() => setSide("con")}
            />
          </div>

          {/* Start */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              선택:{" "}
              <span className="font-semibold text-foreground">
                {side ? (side === "pro" ? "찬성" : "반대") : "미선택"}
              </span>
            </div>

            <Button onClick={start} disabled={!side} className="rounded-full px-8">
              토론 시작하기 →
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SelectCard({
  selected,
  title,
  desc,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="text-left">
      <Card
        className={[
          "rounded-2xl transition",
          "hover:border-primary/60",
          selected ? "border-primary ring-2 ring-primary/25" : "",
        ].join(" ")}
      >
        <CardHeader className="space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border">{icon}</div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="leading-6">{desc}</CardDescription>
        </CardHeader>

        <CardFooter>
          <div
            className={[
              "w-full rounded-xl border px-4 py-2 text-center text-sm font-medium",
              selected ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground",
            ].join(" ")}
          >
            {selected ? "선택됨" : "선택하기"}
          </div>
        </CardFooter>
      </Card>
    </button>
  );
}
