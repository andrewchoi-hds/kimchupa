import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KIMCHI_DATA } from "@/constants/kimchi";
import prisma from "@/lib/prisma";
import RecipeClient from "./RecipeClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const kimchi = KIMCHI_DATA.find((k) => k.id === id);

  if (!kimchi) {
    return { title: "레시피를 찾을 수 없습니다" };
  }

  return {
    title: `${kimchi.name} 만들기 | 김추페 레시피`,
    description: `${kimchi.name} 만드는 법을 단계별로 알아보세요`,
    openGraph: {
      title: `${kimchi.name} 만들기 | 김추페 레시피`,
      description: `${kimchi.name} 만드는 법을 단계별로 알아보세요`,
      type: "article",
      ...(kimchi.imageUrl ? { images: [kimchi.imageUrl] } : {}),
    },
  };
}

export async function generateStaticParams() {
  return KIMCHI_DATA.map((kimchi) => ({
    id: kimchi.id,
  }));
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const kimchi = KIMCHI_DATA.find((k) => k.id === id);

  if (!kimchi) {
    notFound();
  }

  let dbKimchi = null;
  try {
    dbKimchi = await prisma.kimchi.findUnique({
      where: { slug: id },
      include: { ingredients: true },
    });
  } catch (error) {
    console.error("DB 조회 실패:", error);
  }

  const data = {
    id: kimchi.id,
    name: kimchi.name,
    nameEn: kimchi.nameEn,
    imageUrl: dbKimchi?.imageUrl || kimchi.imageUrl,
    makingProcess: dbKimchi?.makingProcess || null,
    ingredients:
      dbKimchi?.ingredients?.map((i) => ({
        name: i.name,
        amount: i.amount,
        isMain: i.isMain,
      })) ||
      kimchi.mainIngredients.map((name) => ({
        name,
        amount: null,
        isMain: true,
      })),
    storageMethod: dbKimchi?.storageMethod || null,
  };

  return <RecipeClient data={JSON.parse(JSON.stringify(data))} />;
}
