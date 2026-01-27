// app/page.jsx
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, CheckCircle2, Trophy } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "실시간 AI토론",
      desc: "다양한 주제로 AI와 실시간 토론을 진행하며 논리적 사고력을 향상시키세요.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "AI 자동 채점",
      desc: "논리성, 근거 제시, 설득력을 다각도로 평가받고 구체적 피드백을 받아보세요.",
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "순위 경쟁",
      desc: "점수를 쌓아 리더보드에서 1등을 차지하고 특별한 보상을 얻어보세요.",
    },
  ];

  const steps = [
    {
      num: 1,
      title: "토론 주제 선택",
      desc: "정치, 경제, 사회, 과학, 문화 등 다양한 카테고리에서 원하는 주제를 선택하세요. 난이도별로 구성되어 있어 초보자부터 전문가까지 모두 참여할 수 있습니다.",
    },
    {
      num: 2,
      title: "AI와 실시간 토론",
      desc: "선택한 주제에 대해 AI와 채팅 방식으로 토론을 진행합니다. AI는 당신의 주장에 논리적으로 반박하며 건설적인 토론을 이끌어냅니다.",
    },
    {
      num: 3,
      title: "평가 및 피드백",
      desc: "토론 종료 후 AI가 논리성, 근거 제시, 설득력을 평가하고 구체적인 피드백을 제공합니다. 점수는 자동으로 누적되어 리더보드에 반영됩니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary">
            WE11YS
          </Link>

          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link href="/debate">토론 시작하기</Link>
            </Button>
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link href="/score">나의 점수</Link>
            </Button>
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link href="/profile">내 프로필</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <div className="flex flex-col items-center text-center">
            <Badge className="rounded-full px-4 py-2 text-sm" variant="secondary">
              AI와 함께 성장하는 토론 학습 플랫폼
            </Badge>

            <h1 className="mt-8 text-4xl font-extrabold leading-tight md:text-5xl">
              AI와 토론 하며 <br />
              <span className="text-primary">논리력</span>을 키우세요
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              실시간 AI토론을 통해 논리성, 근거 제시, 설득력을 향상시키고 <br />
              다른 학습자들과 순위를 겨루며 성장하세요.
            </p>

            <div className="mt-7 flex gap-3">
              <Button asChild className="rounded-full px-6">
                <Link href="/debate">토론 시작하기</Link>
              </Button>
              <Button asChild variant="secondary" className="rounded-full px-6">
                <Link href="/score">내 점수 보기</Link>
              </Button>
            </div>
          </div>

          {/* 카드 3장 */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="rounded-2xl">
                <CardHeader>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border">
                    {f.icon}
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* 어떻게 작동하나요 */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-extrabold md:text-3xl">어떻게 작동하나요?</h2>

          <div className="mt-10 space-y-8">
            {steps.map((s) => (
              <div key={s.num} className="mx-auto flex max-w-3xl items-start gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {s.num}
                </div>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 토론시작하기 카드 */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-10">
            <h3 className="text-2xl font-extrabold md:text-3xl">지금 바로 시작하세요</h3>
            <p className="mt-2 text-sm/6 opacity-90 md:text-base">
              AI와 함께 논리력을 키우고 리더보드 1등에 도전하세요
            </p>
            <div className="mt-6">
              <Button asChild variant="secondary" className="rounded-full px-8">
                <Link href="/debate">토론 시작하기 →</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
          © 2026 AI 토론 서비스
        </div>
      </footer>
    </div>
  );
}
