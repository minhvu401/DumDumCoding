import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1", // Đây là base URL chính xác của Groq
});

export async function POST(request: Request) {
  try {
    const { userId, symptoms, history } = await request.json();

    if (!symptoms) {
      return NextResponse.json(
        { error: "Symptoms are required" },
        { status: 400 }
      );
    }

    const prompt = `
      Bạn là một trợ lý y tế AI từ Groq. Dựa trên các triệu chứng của người dùng ${userId}: ${symptoms}.
      Lịch sử sức khỏe (nếu có): ${history || "Không có thông tin"}.
      Hãy cung cấp lời khuyên y tế sơ bộ bằng tiếng Việt, ngắn gọn và dễ hiểu, bao gồm các bước tự chăm sóc hoặc khuyến nghị đi khám nếu cần.
    `;

    const response = await openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const advice =
      response.choices[0]?.message?.content || "Không có lời khuyên phù hợp.";

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to get advice from Groq" },
      { status: 500 }
    );
  }
}
