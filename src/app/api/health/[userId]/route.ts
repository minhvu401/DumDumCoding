import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type HealthDataRow = {
  id: number;
  userId: string;
  date: string;
  weight: number | null;
  sleepHours: number | null;
  mood: string | null;
  energyLevel: number | null;
  created_at: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const paramsResolved = await params;
  const userId = paramsResolved.userId;
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("health_data")
    .select(
      "id, userId, date, weight, sleepHours, mood, energyLevel, created_at"
    ) // Chọn các cột khớp schema
    .eq("userId", userId) // Sử dụng userId như trong schema
    .eq("date", today);

  if (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Lỗi khi truy vấn dữ liệu" },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Không tìm thấy dữ liệu cho ngày hôm nay" },
      { status: 404 }
    );
  }

  return NextResponse.json(data[0]);
}

async function analyzeWithAI(data: HealthDataRow, historical: HealthDataRow[]) {
  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          userId: data.userId,
          date: data.date,
          weight: data.weight,
          sleepHours: data.sleepHours,
          mood: data.mood,
          energyLevel: data.energyLevel,
        },
        historical_data: historical.map((row) => ({
          weight: row.weight,
          sleepHours: row.sleepHours,
          energyLevel: row.energyLevel,
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, date, weight, sleepHours, mood, energyLevel } = body;

  const { data, error } = await supabase
    .from("health_data")
    .insert([
      {
        userId, // Không cần Number nếu userId là string
        date,
        weight: weight ? Number(weight) : null,
        sleepHours: sleepHours ? Number(sleepHours) : null,
        mood,
        energyLevel: energyLevel ? Number(energyLevel) : null,
        created_at: new Date().toISOString(), // Thêm created_at
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: historicalData, error: histErr } = await supabase
    .from("health_data")
    .select(
      "id, userId, date, weight, sleepHours, mood, energyLevel, created_at"
    )
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(30);

  if (histErr || !historicalData) {
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu lịch sử" },
      { status: 500 }
    );
  }

  const analysis = await analyzeWithAI(data, historicalData);
  return NextResponse.json({ message: "Thêm thành công", analysis });
}

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
    .select(
      "id, userId, date, weight, sleepHours, mood, energyLevel, created_at"
    )
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(30);

  if (histErr || !historicalData) {
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu lịch sử" },
      { status: 500 }
    );
  }

  const analysis = await analyzeWithAI(data, historicalData);
  return NextResponse.json({ message: "Cập nhật thành công", analysis });
}
