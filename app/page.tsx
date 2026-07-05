import HomeDeck from "@/components/HomeDeck";
import { getAllRounds } from "@/lib/rounds";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rodadas = await getAllRounds();
  return <HomeDeck rodadas={rodadas} />;
}
