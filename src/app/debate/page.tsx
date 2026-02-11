// src/app/debate/page.tsx
import Link from "next/link";
import { ArrowLeft, FlaskConical, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { levelBadgeVariant, levelLabel, TopicApi } from "@/dumidata/topics";

async function getTopics(): Promise<TopicApi[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/topics`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
}

export default async function DebateTopicLibraryPage() {
  const topics = await getTopics();

  //  카테고리별 그룹핑 (기존 TOPICS 구조처럼)
  const grouped = topics.reduce<Record<string, TopicApi[]>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  const sections = Object.entries(grouped).map(([category, items]) => ({
    category,
    items,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* 탑바 */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <div className="flex items-center gap-2 font-semibold">
              <FlaskConical className="h-5 w-5 text-primary" />
              토론 주제 라이브러리
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/leaderboard">
                <Trophy className="h-4 w-4" />
                리더보드
              </Link>
            </Button>
            <Button asChild className="gap-2 rounded-full">
              <Link href="/profile">
                <User className="h-4 w-4" />내 프로필
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* 제목 */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">토론 주제를 선택하세요</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            다양한 카테고리와 난이도의 주제로 AI와 토론을 시작하세요
          </p>
        </div>

        <Separator className="my-10" />

        {/* 카테고리 */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.category}>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-1 w-7 rounded-full bg-primary" />
                <h2 className="text-lg font-bold">{section.category}</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((topic) => (
                  <Card key={topic.id} className="rounded-2xl">
                    <CardHeader className="space-y-3">
                      <div>
                        <Badge variant={levelBadgeVariant(topic.level)} className="rounded-full">
                          {levelLabel(topic.level)}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-6 line-clamp-2">{topic.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <p className="text-sm leading-6 text-muted-foreground line-clamp-3">{topic.description ?? ""}</p>
                    </CardContent>

                    <CardFooter className="mt-auto">
                      <Button asChild className="w-full rounded-xl">
                        <Link href={`/debate/${topic.id}`}>토론 시작</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
