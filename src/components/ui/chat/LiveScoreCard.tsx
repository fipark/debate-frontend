"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export type LiveScore = {
  total: number;
  logic: number;
  evidence: number;
  persuasion: number;
  updatedAt: string;
};

export default function LiveScoreCard({ score, loading }: { score: LiveScore; loading?: boolean }) {
  return (
    <Card className="rounded-2xl border p-5">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">실시간 점수</div>
        {loading ? (
          <Badge variant="secondary" className="rounded-full">
            분석 중…
          </Badge>
        ) : (
          <Badge className="rounded-full">반영됨</Badge>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-primary/10 px-5 py-4 text-center">
        <div className="text-sm text-muted-foreground">현재 총점</div>
        <div className="mt-1 text-4xl font-extrabold text-primary">{score.total}</div>
        <div className="text-xs text-muted-foreground">/ 100</div>
        <div className="mt-2 text-xs text-muted-foreground">업데이트: {score.updatedAt}</div>
      </div>

      <div className="mt-5 space-y-4">
        <Row label="논리성" value={score.logic} />
        <Row label="근거 제시" value={score.evidence} />
        <Row label="설득력" value={score.persuasion} />
      </div>

      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        * 점수는 최신 메시지 기준으로 임시 계산됩니다. (나중에 AI 평가 API로 교체)
      </p>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-semibold text-primary">{value}점</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
