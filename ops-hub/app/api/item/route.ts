import { NextResponse } from "next/server";
import { updateItem } from "@/lib/data";
import type { Status } from "@/lib/types";

const VALID: Status[] = ["open", "doing", "done", "unknown"];

export async function PATCH(req: Request) {
  const { id, status, notes } = await req.json();

  if (typeof id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  if (status !== undefined && !VALID.includes(status)) {
    return NextResponse.json({ error: `status must be one of ${VALID.join(", ")}` }, { status: 400 });
  }

  const patch: { status?: Status; notes?: string } = {};
  if (status !== undefined) patch.status = status;
  if (typeof notes === "string") patch.notes = notes;

  const item = await updateItem(id, patch);
  if (!item) return NextResponse.json({ error: "no such item" }, { status: 404 });

  return NextResponse.json(item);
}
