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

// 📥 GET: Lấy tin nhắn hàng ngày cho user
export async function GET(req: NextRequest) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];
  const limit = Number.parseInt(searchParams.get("limit") || "10");

  try {
    // Lấy tin nhắn theo ngày hoặc tất cả tin nhắn gần đây
    let query = supabase
      .from("daily_messages")
      .select(
        `
        id,
        title,
        content,
        messageDate,
        createdBy,
        priority,
        category,
        created_at
      `
      )
      .eq("isActive", true)
      .order("messageDate", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    // Nếu có date parameter, lọc theo ngày cụ thể
    if (searchParams.get("date")) {
      query = query.eq("messageDate", date);
    } else {
      // Lấy tin nhắn từ 7 ngày gần đây
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte(
        "messageDate",
        sevenDaysAgo.toISOString().split("T")[0]
      );
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Lấy riêng user_message_reads cho user hiện tại
    const messageIds = messages?.map((msg) => msg.id) || [];
    const { data: userReads } = await supabase
      .from("user_message_reads")
      .select("message_id, read_at, is_favorited")
      .eq("userId", user.user)
      .in("message_id", messageIds);

    // Merge data
    const formattedMessages = messages?.map((message) => {
      const userRead = userReads?.find(
        (read) => read.message_id === message.id
      );

      return {
        id: message.id,
        title: message.title,
        content: message.content,
        messageDate: message.messageDate,
        createdBy: message.createdBy,
        priority: message.priority,
        category: message.category,
        createdAt: message.created_at,
        isRead: !!userRead,
        isFavorited: userRead?.is_favorited || false,
        readAt: userRead?.read_at || null,
      };
    });

    return NextResponse.json({
      messages: formattedMessages || [],
      currentUser: {
        userId: user.user,
        userName: user.userName,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ POST: Đánh dấu tin nhắn đã đọc hoặc yêu thích
export async function POST(req: NextRequest) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { messageId, action } = await req.json();

    if (!messageId || !action) {
      return NextResponse.json(
        { error: "messageId and action are required" },
        { status: 400 }
      );
    }

    if (action === "mark_read") {
      // Đánh dấu đã đọc
      const { error } = await supabase.from("user_message_reads").upsert(
        {
          userId: user.user,
          message_id: messageId,
          read_at: new Date().toISOString(),
        },
        {
          onConflict: "message_id",
        }
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ message: "Đã đánh dấu đã đọc" });
    } else if (action === "toggle_favorite") {
      // Toggle yêu thích
      const { data: existing } = await supabase
        .from("user_message_reads")
        .select("is_favorited")
        .eq("userId", user.user)
        .eq("message_id", messageId)
        .single();

      const newFavoriteStatus = !existing?.is_favorited;

      const { error } = await supabase.from("user_message_reads").upsert(
        {
          userId: user.user,
          message_id: messageId,
          is_favorited: newFavoriteStatus,
          read_at: new Date().toISOString(),
        },
        {
          onConflict: "message_id",
        }
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        message: newFavoriteStatus
          ? "Đã thêm vào yêu thích"
          : "Đã bỏ yêu thích",
        isFavorited: newFavoriteStatus,
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
