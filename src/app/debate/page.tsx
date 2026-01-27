// src/app/debate/page.tsx
import Link from "next/link";
import { ArrowLeft, FlaskConical, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TOPICS = [
  {
    category: "과학",
    items: [
      {
        id: "science-ai-jobs",
        level: "중급",
        title: "인공지능은 인간의 일자리를 위협하는가?",
        desc: "AI 기술의 발전이 고용 시장에 미치는 영향에 대해 토론합니다. 자동화로 인한 일자리 감소와 새로운 직업 창출의 균형을 논의해보세요.",
      },
      {
        id: "science-crispr",
        level: "고급",
        title: "유전자 편집 기술은 인간에게 사용되어야 하는가?",
        desc: "CRISPR 등 유전자 편집 기술의 의료적 활용과 윤리적 문제를 토론합니다. 질병 치료와 인간 존엄성의 균형을 논의해보세요.",
      },
    ],
  },
  {
    category: "경제",
    items: [
      {
        id: "economy-ubi",
        level: "고급",
        title: "기본소득제는 실현 가능한가?",
        desc: "모든 국민에게 조건 없이 일정 금액을 지급하는 기본소득제의 경제적 타당성과 사회적 영향을 토론합니다.",
      },
    ],
  },
  {
    category: "사회",
    items: [
      {
        id: "society-school-phone",
        level: "초급",
        title: "학교에서 스마트폰 사용을 금지해야 하는가?",
        desc: "교육 환경에서 스마트폰 사용의 장단점을 분석하고, 학생들의 학습 집중도와 디지털 리터러시 사이의 균형을 논의합니다.",
      },
      {
        id: "society-carbon-tax",
        level: "중급",
        title: "기후변화 대응을 위한 탄소세는 필요한가?",
        desc: "환경 보호를 위한 탄소세 도입의 경제적 영향과 효과성에 대해 토론합니다. 산업 경쟁력과 환경 보호의 균형을 고려해보세요.",
      },
      {
        id: "society-animal-test",
        level: "초급",
        title: "동물실험은 금지되어야 하는가?",
        desc: "의학·과학 연구를 위한 동물실험의 필요성과 동물 권리 보호 사이의 균형을 토론합니다.",
      },
    ],
  },
];

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
