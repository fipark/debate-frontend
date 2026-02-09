export const TOPICS = [
  {
    category: "과학",
    items: [
      {
        id: "science-ai-jobs",
        level: "중급",
        title: "인공지능은 인간의 일자리를 위협하는가?",
        desc: "AI 기술의 발전이 고용 시장에 미치는 영향에 대해 토론합니다. 자동화로 인한 일자리 감소와 새로운 직업 창출의 균형을 논의해보세요.",
      },
      {
        id: "science-crispr",
        level: "고급",
        title: "유전자 편집 기술은 인간에게 사용되어야 하는가?",
        desc: "CRISPR 등 유전자 편집 기술의 의료적 활용과 윤리적 문제를 토론합니다. 질병 치료와 인간 존엄성의 균형을 논의해보세요.",
      },
    ],
  },
  {
    category: "경제",
    items: [
      {
        id: "economy-ubi",
        level: "고급",
        title: "기본소득제는 실현 가능한가?",
        desc: "모든 국민에게 조건 없이 일정 금액을 지급하는 기본소득제의 경제적 타당성과 사회적 영향을 토론합니다.",
      },
    ],
  },
  {
    category: "사회",
    items: [
      {
        id: "society-school-phone",
        level: "초급",
        title: "학교에서 스마트폰 사용을 금지해야 하는가?",
        desc: "교육 환경에서 스마트폰 사용의 장단점을 분석하고, 학생들의 학습 집중도와 디지털 리터러시 사이의 균형을 논의합니다.",
      },
      {
        id: "society-carbon-tax",
        level: "중급",
        title: "기후변화 대응을 위한 탄소세는 필요한가?",
        desc: "환경 보호를 위한 탄소세 도입의 경제적 영향과 효과성에 대해 토론합니다. 산업 경쟁력과 환경 보호의 균형을 고려해보세요.",
      },
      {
        id: "society-animal-test",
        level: "초급",
        title: "동물실험은 금지되어야 하는가?",
        desc: "의학·과학 연구를 위한 동물실험의 필요성과 동물 권리 보호 사이의 균형을 토론합니다.",
      },
    ],
  },
];

export function getTopicById(topicId: string) {
  for (const section of TOPICS) {
    const t = section.items.find((x) => x.id === topicId);
    if (t) return { ...t, category: section.category };
  }
  return null;
}
