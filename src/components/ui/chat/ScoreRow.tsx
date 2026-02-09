"use client";

import { Progress } from "@/components/ui/progress";

export default function ScoreRow({ label, value }: { label: string; value: number }) {
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
