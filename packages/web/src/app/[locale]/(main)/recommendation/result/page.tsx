import type { Metadata } from "next";
import ResultClient from "./ResultClient";

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const type = params.type || "김치 올라운더";
  const emoji = params.emoji || "🥬";
  const desc = params.desc || "나에게 맞는 김치를 찾았어요!";

  return {
    title: `${emoji} ${type} | 김추페 김치 추천`,
    description: desc,
    openGraph: {
      title: `${emoji} 나의 김치 유형: ${type}`,
      description: desc,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${emoji} 나의 김치 유형: ${type}`,
      description: desc,
    },
  };
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;
  return <ResultClient params={params} />;
}
