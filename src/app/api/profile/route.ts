import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

// Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Middleware: xác thực token + kiểm tra role
function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userName: string;
      role: string;
    };

    if (decoded.role !== "user") return null;
    return decoded;
  } catch {
    return null;
  }
}

// 📥 GET: Lấy profile user đang đăng nhập
export async function GET(req: NextRequest) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("account")
    .select("userId, userName, fullName, email, phoneNumber, avatar, status")
    .eq("userName", user.userName)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// ✏️ PUT: Cập nhật fullName, avatar, phoneNumber
export async function PUT(req: NextRequest) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fullName, avatar, phoneNumber } = await req.json();

  const { error } = await supabase
    .from("account")
    .update({
      fullName,
      avatar,
      phoneNumber,
    })
    .eq("userName", user.userName);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Cập nhật thành công" });
}
