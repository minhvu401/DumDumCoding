import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Kiểm tra token + role === "user"
function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
      userName: string;
      fullName: string;
    };

    if (decoded.role !== "user") return null;
    return decoded;
  } catch {
    return null;
  }
}

// ➕ POST: tạo to-do
export async function POST(req: NextRequest) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, startTime, endTime, date } = await req.json();

  const { error } = await supabase.from("todos").insert({
    userId: user.userId,
    title,
    description,
    startTime,
    endTime,
    date,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "To-do created" }, { status: 201 });
}

// 📥 GET: lấy to-do theo ngày
export async function GET(req: NextRequest) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("userId", user.userId)
    .eq("date", date)
    .order("startTime");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
