"use client";

import { Brain, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DebateResult } from "@/lib/chat/chat";
import ScoreRow from "@/components/ui/chat/ScoreRow";

export default function ResultDialog({
  open,
  onOpenChange,
  result,
  onNewDebate,
  onGoLeaderboard,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: DebateResult | null;
  onNewDebate: () => void;
  onGoLeaderboard: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130 rounded-2xl p-0 overflow-hidden [&>button]:hidden">
        {/* 헤더 */}
        <div className="relative px-6 pt-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background hover:bg-muted"
            aria-label="close"
          >
            <X className="h-4 w-4" />
          </button>

          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Brain className="h-4 w-4" />
              </span>
              토론 평가 결과
            </DialogTitle>
            <DialogDescription>AI가 당신의 토론을 평가했습니다</DialogDescription>
          </DialogHeader>
        </div>

        {/* 본문 */}
        {result && (
          <div className="px-6 pb-6">
            {/* 총점 카드 */}
            <div className="mt-4 rounded-xl bg-primary/10 px-6 py-5 text-center">
              <div className="text-sm text-muted-foreground">총점</div>
              <div className="mt-1 text-4xl font-extrabold text-primary">{result.total}</div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>

            <div className="mt-5 space-y-4">
              <ScoreRow label="논리성" value={result.logic} />
              <ScoreRow label="근거 제시" value={result.evidence} />
              <ScoreRow label="설득력" value={result.persuasion} />
            </div>

            <Separator className="my-5" />

            {/* AI 피드백 */}
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="mb-2 text-sm font-semibold">AI 피드백</div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{result.feedback}</p>
            </div>

            {/* 하단 버튼 */}
            <DialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" className="w-full rounded-xl sm:w-1/2" onClick={onNewDebate}>
                새 토론 시작
              </Button>

              <Button className="w-full rounded-xl sm:w-1/2" onClick={onGoLeaderboard}>
                나의 점수 보러가기
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
