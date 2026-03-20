import { rankingService } from "@kimchupa/api";
import RankingClient from "./RankingClient";

export default async function RankingPage() {
  let initialData = null;
  try {
    initialData = await rankingService.getXpRanking(20);
  } catch {
    // DB connection failure - client will retry
  }

  return <RankingClient initialData={initialData} />;
}
