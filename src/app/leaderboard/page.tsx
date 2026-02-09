"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Crown, Star } from "lucide-react";
import { getMyStats } from "@/dumidata/leaderboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LeaderboardPage() {
  const { my, myRank, top10, meInTop10 } = getMyStats();

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
              <Trophy className="h-5 w-5 text-primary" />
              리더보드
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/debate">토론 시작</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/profile">내 프로필</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* 내 순위 */}
          <Card className="rounded-2xl border px-6 py-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Star className="h-5 w-5 text-primary" />내 순위
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
              <Stat value={myRank ?? 0} label="순위" highlight />
              <Stat value={my?.totalScore ?? 0} label="총점" />
              <Stat value={my?.debates ?? 0} label="토론 수" />
              <Stat value={my?.avgScore ?? 0} label="평균 점수" />
            </div>
          </Card>

          {/* 전체 순위 */}
          <Card className="rounded-2xl border p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="text-base font-semibold">전체 순위</div>
              <div className="text-sm text-muted-foreground">모든 참가자의 순위를 확인하세요</div>
            </div>

            <div className="mt-5 space-y-3">
              {top10.map((u, idx) => (
                <RankRow key={u.id} user={u} rank={idx + 1} />
              ))}

              {/*  내가 Top10 밖이면, 내 순위만 따로 아래에 표시 */}
              {!meInTop10 && my && (
                <>
                  <Separator className="my-4" />
                  <div className="text-sm font-semibold">내 순위</div>
                  <RankRow user={my} rank={myRank ?? 0} isSolo />
                </>
              )}
            </div>
          </Card>

          {/* 1등 상품 안내 */}
          <Card className="rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Trophy className="h-5 w-5 text-primary" />
              1등 상품 안내
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              리더보드 1위를 차지한 사용자에게는 특별한 보상이 제공됩니다. 꾸준히 토론에 참여하고 높은 점수를 획득하여
              챔피언이 되어보세요!
            </p>

            <div className="mt-5 rounded-2xl bg-primary/10 p-5">
              <div className="font-semibold">상품 수령 방법</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>매달 말일 기준 1위 사용자에게 연락</li>
                <li>프로필에 등록된 이메일로 안내 발송</li>
                <li>상품은 다음 달 초에 지급</li>
              </ul>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Stat({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className="py-2">
      <div className={highlight ? "text-3xl font-extrabold text-primary" : "text-3xl font-extrabold"}>{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function RankRow({
  user,
  rank,
  isSolo,
}: {
  user: { name: string; debates: number; avgScore: number; totalScore: number; isMe?: boolean };
  rank: number;
  isSolo?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between rounded-2xl border bg-primary/5 p-4",
        isSolo ? "border-dashed" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
          {rank === 1 ? (
            <Crown className="h-5 w-5 text-yellow-500" />
          ) : (
            <span className="text-sm font-semibold">{rank}</span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{user.name}</div>
            {user.isMe && (
              <Badge variant="secondary" className="rounded-full">
                나
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {user.debates}회 토론 · 평균 {user.avgScore}점
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-2xl font-bold text-primary">{user.totalScore}</div>
        <div className="text-xs text-muted-foreground">총점</div>
      </div>
    </div>
  );
}
