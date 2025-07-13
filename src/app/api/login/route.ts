// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/jwt";

// Khởi tạo Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userName, password } = await req.json();

    if (!userName || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ username và password" },
        { status: 400 }
      );
    }

    // Gọi hàm RPC để tìm user theo username
    const { data: users, error } = await supabase.rpc(
      "search_user_by_username",
      {
        username_input: userName,
      }
    );

    if (error) {
      console.error("❌ Lỗi Supabase:", error);
      return NextResponse.json(
        { error: "Lỗi máy chủ Supabase" },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Sai tên đăng nhập hoặc mật khẩu" },
        { status: 401 }
      );
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Sai tên đăng nhập hoặc mật khẩu" },
        { status: 401 }
      );
    }

    // Tạo JWT token
    const token = signToken({
      fullName: user.fullName,
      userName: user.userName,
      role: user.role,
    });

    return NextResponse.json(
      {
        token,
        user: {
          fullName: user.fullName,
          userName: user.userName,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Lỗi xử lý login:", err);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
