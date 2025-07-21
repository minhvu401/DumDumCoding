import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type HealthDataRow = {
  userId: string;
  date: string;
  weight: number | null;
  sleepHours: number | null;
  energyLevel: number | null;
  mood: string;
};
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("health_data")
    .select("*")
    .eq("userId", userId)
    .eq("date", today)
    .single();

  if (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Không tìm thấy dữ liệu" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
// Gọi đến AI phân tích
async function analyzeWithAI(data: HealthDataRow, historical: HealthDataRow[]) {
  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          user_id: data.userId,
          date: data.date,
          weight: data.weight,
          sleep_hours: data.sleepHours,
          mood: data.mood,
          energy_level: data.energyLevel,
        },
        historical_data: historical.map((row) => ({
          weight: row.weight,
          sleep_hours: row.sleepHours,
          energy_level: row.energyLevel,
        })),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error("Lỗi AI: " + text);
    }

    return await response.json();
  } catch (error) {
    console.error("AI service error:", error);
    return { error: "Phân tích AI thất bại" };
  }
}

// API POST - tạo dữ liệu mới
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, date, weight, sleepHours, mood, energyLevel } = body;

  const { data, error } = await supabase
    .from("health_data")
    .insert([
      {
        userId: Number(userId),
        date,
        weight: weight ? Number(weight) : null,
        sleepHours: sleepHours ? Number(sleepHours) : null,
        mood,
        energyLevel: energyLevel ? Number(energyLevel) : null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Lấy lịch sử
  const { data: historicalData, error: histErr } = await supabase
    .from("health_data")
    .select("*")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(30);

  if (histErr || !historicalData) {
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu lịch sử" },
      { status: 500 }
    );
  }

  // Gọi AI
  const analysis = await analyzeWithAI(data, historicalData);
  return NextResponse.json({ message: "Thêm thành công", analysis });
}

// API PUT - cập nhật dữ liệu hiện tại
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { userId, date, weight, sleepHours, mood, energyLevel } = body;

  const { data, error } = await supabase
    .from("health_data")
    .update({
      weight: weight ? Number(weight) : null,
      sleepHours: sleepHours ? Number(sleepHours) : null,
      mood,
      energyLevel: energyLevel ? Number(energyLevel) : null,
    })
    .eq("userId", userId)
    .eq("date", date)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: historicalData, error: histErr } = await supabase
    .from("health_data")
    .select("*")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(30);

  if (histErr || !historicalData) {
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu lịch sử" },
      { status: 500 }
    );
  }

  // Gọi AI
  const analysis = await analyzeWithAI(data, historicalData);
  return NextResponse.json({ message: "Cập nhật thành công", analysis });
}
