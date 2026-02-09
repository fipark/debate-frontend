"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const canSubmit = email.trim() && password.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);

      // ✅ 나중에 백엔드 엔드포인트로 교체
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { ... })
      // const data = await res.json()

      console.log("LOGIN payload", { email, password });
      alert("로그인 시도(더미). 나중에 API로 교체하면 됩니다.");
    } catch {
      alert("로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl border p-6">
        <div className="mb-6 text-center">
          <div className="text-2xl font-extrabold">로그인</div>
          <p className="mt-2 text-sm text-muted-foreground">토론 서비스에 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-12 rounded-xl pl-9"
              placeholder="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-12 rounded-xl pl-9"
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="h-12 w-full rounded-xl" disabled={!canSubmit || loading}>
            {loading ? "로그인 중…" : "로그인"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          아직 계정이 없나요?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            회원가입
          </Link>
        </div>
      </Card>
    </div>
  );
}
