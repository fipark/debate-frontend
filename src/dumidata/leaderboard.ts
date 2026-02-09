export type Leader = {
  id: string;
  name: string;
  debates: number;
  avgScore: number;
  totalScore: number;
  isMe?: boolean;
};

export const LEADERS: Leader[] = [
  { id: "u1", name: "** 김", debates: 12, avgScore: 86, totalScore: 1032 },
  { id: "u2", name: "** 이", debates: 10, avgScore: 84, totalScore: 840 },
  { id: "u3", name: "** 박", debates: 9, avgScore: 83, totalScore: 747 },
  { id: "u4", name: "** 최", debates: 8, avgScore: 82, totalScore: 656 },
  { id: "u5", name: "** 정", debates: 7, avgScore: 80, totalScore: 560 },
  { id: "u6", name: "** 한", debates: 6, avgScore: 79, totalScore: 474 },
  { id: "me", name: "준환 박", debates: 4, avgScore: 72, totalScore: 100, isMe: true },
  { id: "u7", name: "** 장", debates: 4, avgScore: 70, totalScore: 280 },
  { id: "u8", name: "** 오", debates: 3, avgScore: 68, totalScore: 204 },
  { id: "u9", name: "** 문", debates: 2, avgScore: 65, totalScore: 130 },
  { id: "u10", name: "** 이", debates: 10, avgScore: 84, totalScore: 840 },
  { id: "u11", name: "** 이", debates: 10, avgScore: 84, totalScore: 840 },
  { id: "u12", name: "** 이", debates: 10, avgScore: 84, totalScore: 840 },
  { id: "u13", name: "** 이", debates: 2, avgScore: 88, totalScore: 940 },
  { id: "u14", name: "다은 유", debates: 2, avgScore: 60, totalScore: 120 },
];

export function getSortedLeaders(list: Leader[] = LEADERS) {
  return [...list].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
    return b.debates - a.debates;
  });
}

export function sortLeaders(list: Leader[] = LEADERS) {
  return [...list].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
    return b.debates - a.debates;
  });
}

export function getMyStats(list: Leader[] = LEADERS) {
  const sorted = sortLeaders(list);
  const my = sorted.find((x) => x.isMe) ?? null;
  const myRank = my ? sorted.findIndex((x) => x.id === my.id) + 1 : null;

  const top10 = sorted.slice(0, 10);
  const meInTop10 = my ? top10.some((x) => x.id === my.id) : false;

  return { sorted, my, myRank, top10, meInTop10 };
}
