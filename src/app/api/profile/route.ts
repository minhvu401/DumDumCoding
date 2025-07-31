import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { signToken } from "../../../../lib/jwt";

// Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userName: string;
      role: string;
      user: number;
      fullName: string;
      avatar: string | null;
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

  const formData = await req.formData();
  const fullName = formData.get("fullName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl = user.avatar;

  if (avatarFile) {
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    const filePath = `avatars/${Date.now()}_${avatarFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: avatarFile.type,
        upsert: true,
      });

    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    avatarUrl = publicUrl;
  }

  const { error } = await supabase
    .from("account")
    .update({
      fullName,
      phoneNumber,
      avatar: avatarUrl,
    })
    .eq("userName", user.userName);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: updatedUser, error: fetchError } = await supabase
    .from("account")
    .select(
      "userId, userName, fullName, email, phoneNumber, avatar, status, role"
    )
    .eq("userName", user.userName)
    .single();

  if (fetchError)
    return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const newToken = signToken({
    fullName: updatedUser.fullName,
    userName: updatedUser.userName,
    role: updatedUser.role,
    avatar: updatedUser.avatar || null,
    user: updatedUser.userId,
  });

  return NextResponse.json({
    message: "Cập nhật thành công",
    token: newToken,
    user: updatedUser,
  });
}
