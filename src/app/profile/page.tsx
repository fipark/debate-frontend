"use client";

import Link from "next/link";
import { ArrowLeft, Brain, LogOut, BarChart3, MessageSquare, Award, TrendingUp, CalendarDays } from "lucide-react";
import { getMyStats } from "@/dumidata/leaderboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type SessionStatus = "완료" | "진행 중";

type DebateSession = {
  id: string;
  status: SessionStatus;
  date: string;
  actionLabel: string; // "상세보기" | "계속하기"
  href: string;
};

export default function ProfilePage() {
  //  더미 (나중에 API로 교체)
  const user = {
    name: "준환 박",
    email: "fipark2002@gmail.com",
    initials: "준",
  };

  const { my, myRank } = getMyStats();

  const sessions: DebateSession[] = [
    { id: "150004", status: "완료", date: "2026. 2. 3.", actionLabel: "상세보기", href: "/sessions/150004" },
    {
      id: "150003",
      status: "진행 중",
      date: "2026. 2. 3.",
      actionLabel: "계속하기",
      href: "/debate/some-topic/chat?resume=150003",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/debate">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <div className="flex items-center gap-2 font-semibold">
              <Brain className="h-5 w-5 text-primary" />내 프로필
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/debate">토론 시작</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/leaderboard">리더보드</Link>
            </Button>
            <Button variant="outline" className="rounded-full gap-2">
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* 프로필카드 */}
          <Card className="rounded-2xl border px-6 py-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xl font-bold">{user.initials}</span>
              </div>

              <div>
                <div className="text-lg font-bold">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>
          </Card>

          {/* 내 정보 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Award className="h-5 w-5" />} label="순위" value={myRank ?? 0} highlight />
            <StatCard icon={<BarChart3 className="h-5 w-5" />} label="총점" value={my?.totalScore ?? 0} />
            <StatCard icon={<MessageSquare className="h-5 w-5" />} label="토론 수" value={my?.debates ?? 0} />
            <StatCard icon={<TrendingUp className="h-5 w-5" />} label="평균 점수" value={my?.avgScore ?? 0} />
          </div>

          {/* Debate 기록 */}
          <Card className="rounded-2xl border p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="text-base font-semibold">토론 기록</div>
              <div className="text-sm text-muted-foreground">지금까지 참여한 토론 세션을 확인하세요</div>
            </div>

            <div className="mt-5 space-y-4">
              {sessions.map((s) => (
                <SessionRow key={s.id} session={s} />
              ))}
            </div>
          </Card>

          <Separator />
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className="rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </div>
      <div className={highlight ? "mt-4 text-3xl font-extrabold text-primary" : "mt-4 text-3xl font-extrabold"}>
        {value}
      </div>
    </Card>
  );
}

function SessionRow({
  session,
}: {
  session: { id: string; status: "완료" | "진행 중"; date: string; actionLabel: string; href: string };
}) {
  const isDone = session.status === "완료";

  return (
    <Card className="rounded-2xl border px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Badge
            className={[
              "rounded-full px-3 py-1",
              isDone ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100",
            ].join(" ")}
          >
            {session.status}
          </Badge>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {session.date}
            </div>
            <div className="text-sm text-muted-foreground">세션 ID: {session.id}</div>
          </div>
        </div>

        <Button asChild variant="ghost" className="rounded-full">
          <Link href={session.href}>{session.actionLabel}</Link>
        </Button>
      </div>
    </Card>
  );
}
