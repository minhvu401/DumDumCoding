import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "../../../../utils/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userName,
      password,
      email,
      phoneNumber,
      fullName,
      avatar,
      role = "user", // 👈 Mặc định là 'user'
      status = true, // 👈 Mặc định là true
    } = body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert vào Supabase
    const { error } = await supabase.from("account").insert([
      {
        userName,
        password: hashedPassword,
        email,
        phoneNumber,
        fullName,
        avatar,
        role,
        status,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Không thể tạo tài khoản" },
        { status: 500 }
      );
    }

    return NextResponse.json({ userName: userName }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
