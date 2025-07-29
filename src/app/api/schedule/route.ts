import { type NextRequest, NextResponse } from "next/server";
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
      user: number;
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

// 📝 Type definitions for update data
interface CompletionUpdateData {
  isCompleted: boolean;
}

interface PostponeUpdateData {
  date: string;
  startTime: string;
  endTime: string;
}

type TodoUpdateData = CompletionUpdateData | PostponeUpdateData;

// ➕ POST: tạo to-do
export async function POST(req: NextRequest) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, startTime, endTime, date } = await req.json();

  const { data, error } = await supabase
    .from("todos")
    .insert({
      userId: user.user,
      title,
      description,
      startTime,
      endTime,
      date,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    })
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      message: "To-do created",
      data: data?.[0],
      userId: user.user,
      userName: user.userName,
      fullName: user.fullName,
    },
    { status: 201 }
  );
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
    .eq("userId", user.user)
    .eq("date", date)
    .order("startTime");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    todos: data,
    currentUser: {
      userId: user.user,
      userName: user.userName,
      fullName: user.fullName,
      role: user.role,
    },
  });
}

// 🔄 PUT: cập nhật trạng thái hoàn thành hoặc postpone
export async function PUT(req: NextRequest) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { todoId, isCompleted, postponeData } = await req.json();

  console.log(
    "Received todoId:",
    todoId,
    "isCompleted:",
    isCompleted,
    "postponeData:",
    postponeData
  ); // Debug

  if (!todoId) {
    return NextResponse.json({ error: "todoId is required" }, { status: 400 });
  }

  let updateData: TodoUpdateData;

  // Nếu là postpone
  if (postponeData) {
    const { newDate, newStartTime, newEndTime } = postponeData;

    // Validate: không được set về quá khứ
    const now = new Date();
    const newDateTime = new Date(`${newDate}T${newStartTime}`);

    if (newDateTime <= now) {
      return NextResponse.json(
        { error: "Cannot postpone to past or current time" },
        { status: 400 }
      );
    }

    updateData = {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    } as PostponeUpdateData;
  } else {
    // Nếu là toggle complete
    updateData = { isCompleted } as CompletionUpdateData;
  }

  const { data, error } = await supabase
    .from("todos")
    .update(updateData)
    .eq("toDoId", todoId)
    .eq("userId", user.user)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    message: postponeData
      ? "Todo postponed successfully"
      : "Todo updated successfully",
    data: data?.[0],
  });
}
