export async function shareResult(data: {
  type: string;
  emoji: string;
  desc: string;
  kimchiNames: string[];
  scores: number[];
}) {
  const params = new URLSearchParams({
    type: data.type,
    emoji: data.emoji,
    desc: data.desc,
    kimchi: data.kimchiNames.join(","),
    scores: data.scores.join(","),
  });

  const url = `${window.location.origin}/recommendation/result?${params}`;

  // Try Web Share API first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${data.emoji} 나의 김치 유형: ${data.type}`,
        text: `${data.desc} 나에게 맞는 김치를 찾아봤어요!`,
        url,
      });
      return { shared: true };
    } catch {
      // User cancelled or not supported
    }
  }

  // Fallback: copy to clipboard
  await navigator.clipboard.writeText(url);
  return { shared: false, copied: true, url };
}

export function getKakaoShareConfig(data: {
  type: string;
  emoji: string;
  desc: string;
  url: string;
}) {
  return {
    objectType: "feed" as const,
    content: {
      title: `${data.emoji} 나의 김치 유형: ${data.type}`,
      description: data.desc,
      imageUrl: "https://kimchupa.vercel.app/icons/icon.svg",
      link: { mobileWebUrl: data.url, webUrl: data.url },
    },
    buttons: [
      {
        title: "나도 해보기",
        link: {
          mobileWebUrl: `${data.url.split("/result")[0]}`,
          webUrl: `${data.url.split("/result")[0]}`,
        },
      },
    ],
  };
}
