export type Role = "assistant" | "user" | "moderator";
export type MessageStatus = "done" | "streaming";

export type Message = {
  id: string;
  role: Role;
  content: string;
  time: string;
  kind?: "intro";
  status?: MessageStatus;
};

// 시간 포맷
export function formatTime(d = new Date()) {
  const h = d.getHours();
  const m = d.getMinutes();
  const isPM = h >= 12;
  const hh = ((h + 11) % 12) + 1;
  const mm = String(m).padStart(2, "0");
  return `${isPM ? "오후" : "오전"} ${String(hh).padStart(2, "0")}:${mm}`;
}

export type DebateResult = {
  total: number;
  logic: number;
  evidence: number;
  persuasion: number;
  feedback: string;
};
