// src/app/debate/page.tsx
import Link from "next/link";
import { ArrowLeft, FlaskConical, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TOPICS } from "@/dumidata/topics";

function levelBadgeVariant(level: string) {
  if (level === "초급") return "secondary" as const;
  if (level === "중급") return "outline" as const;
  return "destructive" as const;
}

export default function DebateTopicLibraryPage() {
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
          {TOPICS.map((section) => (
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
                          {topic.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-6 line-clamp-2">{topic.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <p className="text-sm leading-6 text-muted-foreground line-clamp-3">{topic.desc}</p>
                    </CardContent>

                    <CardFooter className="mt-auto">
                      {/* 토론 시작 -> 주제별 토론방으로 이동  */}
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
