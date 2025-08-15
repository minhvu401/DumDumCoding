import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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

// 🔐 PATCH: Đổi mật khẩu (nhập mật khẩu cũ và mật khẩu mới)
export async function PATCH(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { oldPassword, newPassword } = body as {
      oldPassword?: string;
      newPassword?: string;
    };

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Vui lòng nhập đủ mật khẩu cũ và mật khẩu mới" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Mật khẩu mới phải có ít nhất 8 ký tự" },
        { status: 400 }
      );
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: "Mật khẩu mới không được trùng với mật khẩu cũ" },
        { status: 400 }
      );
    }

    // Lấy hash mật khẩu hiện tại
    const { data: account, error: fetchErr } = await supabase
      .from("account")
      .select("password")
      .eq("userName", user.userName)
      .single();

    if (fetchErr || !account?.password) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản" },
        { status: 404 }
      );
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(
      oldPassword,
      account.password as string
    );
    if (!isMatch) {
      return NextResponse.json(
        { error: "Mật khẩu cũ không đúng" },
        { status: 400 }
      );
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    const { error: updateErr } = await supabase
      .from("account")
      .update({ password: hashedPassword })
      .eq("userName", user.userName);

    if (updateErr) {
      return NextResponse.json(
        { error: "Không thể cập nhật mật khẩu" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi đổi mật khẩu" },
      { status: 500 }
    );
  }
}

/*
Ghi chú bảo mật:
- API này kiểm tra xác thực người dùng bằng JWT trước khi xử lý, phù hợp với khuyến nghị bảo vệ API Routes của Next.js (xác thực và phân quyền) [^1][^2].
*/
