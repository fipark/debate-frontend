export async function wordStream(
  fullText: string,
  onChunk: (current: string) => void,
  opts?: {
    minDelayMs?: number; // 기본 35
    maxDelayMs?: number; // 기본 90
    punctuationPauseMs?: number; // 기본 220
  }
) {
  const minDelayMs = opts?.minDelayMs ?? 35;
  const maxDelayMs = opts?.maxDelayMs ?? 90;
  const punctuationPauseMs = opts?.punctuationPauseMs ?? 220;

  // 공백 단위로 나누되, 연속 공백은 정리
  const words = fullText.replace(/\s+/g, " ").trim().split(" ");

  let current = "";
  for (let i = 0; i < words.length; i++) {
    current = current ? `${current} ${words[i]}` : words[i];
    onChunk(current);

    // 단어마다 랜덤 딜레이(사람 타이핑 느낌)
    const base = rand(minDelayMs, maxDelayMs);

    // 문장부호 뒤는 잠깐 멈추기
    const lastChar = words[i].slice(-1);
    const extra =
      [".", "!", "?", "…"].includes(lastChar) || /[.?!…]$/.test(words[i])
        ? punctuationPauseMs
        : /[,，]$/.test(words[i])
        ? Math.floor(punctuationPauseMs * 0.6)
        : 0;

    await sleep(base + extra);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
