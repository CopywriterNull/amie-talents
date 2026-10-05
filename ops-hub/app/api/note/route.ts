import { NextResponse } from "next/server";
import { addNote, deleteNote } from "@/lib/data";

export async function POST(req: Request) {
  const { body } = await req.json();
  if (typeof body !== "string" || !body.trim()) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }
  return NextResponse.json(await addNote(body.trim()));
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (typeof id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  await deleteNote(id);
  return NextResponse.json({ ok: true });
}
