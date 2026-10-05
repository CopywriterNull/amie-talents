import Board from "@/components/Board";
import { readAgents, readBoard, readOwed, today } from "@/lib/data";

// The board is a file on disk that a cron job rewrites — never prerender it.
export const dynamic = "force-dynamic";

export default async function Page() {
  const [board, owed, agents] = await Promise.all([readBoard(), readOwed(), readAgents()]);
  return <Board initial={board} owed={owed} agents={agents} todayISO={today()} />;
}
