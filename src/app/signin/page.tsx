"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api } from "@/lib/api/api";
import { setTokens } from "@/lib/auth";
import axios from "axios";
import { useRouter } from "next/navigation";

type LoginResponse = { accessToken: string; refreshToken: string };
type ApiErrorBody = { message?: string; error?: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const canSubmit = email.trim() && password.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);

      const res = await api.post<LoginResponse>("/auth/signin", {
        email,
        password,
      });

      //  토큰 저장
      setTokens(res.data);

      alert("로그인 성공!");
      router.push("/"); // 원하는 페이지로
    } catch (err) {
      if (axios.isAxiosError<ApiErrorBody>(err)) {
        alert(err.response?.data?.message ?? err.response?.data?.error ?? "로그인 실패");
      } else {
        alert("로그인 실패");
      }
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
