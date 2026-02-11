"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api/api";
import axios from "axios";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const canSubmit = name.trim() && email.trim() && password.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        email,
        password,
        name,
      });

      // 예: { id, email, name }
      console.log("SIGNUP success:", res.data);
      alert(`회원가입 성공! (${res.data.name}) 님`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message ?? err.response?.data?.error ?? "회원가입 실패";
        alert(msg);
      } else {
        alert("회원가입 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl border p-6">
        <div className="mb-6 text-center">
          <div className="text-2xl font-extrabold">회원가입</div>
          <p className="mt-2 text-sm text-muted-foreground">간단하게 계정을 만들어보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-12 rounded-xl pl-9"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" className="h-12 w-full rounded-xl" disabled={!canSubmit || loading}>
            {loading ? "가입 중…" : "회원가입"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          이미 계정이 있나요?{" "}
          <Link href="/signin" className="font-semibold text-primary hover:underline">
            로그인
          </Link>
        </div>
      </Card>
    </div>
  );
}
