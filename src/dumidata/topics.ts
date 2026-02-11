export type TopicApi = {
  id: number; // 지금 DB가 숫자 id면 number
  title: string;
  description: string | null;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
};

export function levelLabel(level: TopicApi["level"]) {
  if (level === "BEGINNER") return "초급";
  if (level === "INTERMEDIATE") return "중급";
  return "고급";
}

export function levelBadgeVariant(level: TopicApi["level"]) {
  if (level === "BEGINNER") return "secondary" as const;
  if (level === "INTERMEDIATE") return "outline" as const;
  return "destructive" as const;
}
