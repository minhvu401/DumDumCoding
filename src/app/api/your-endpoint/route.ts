import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
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
      Bạn là một trợ lý y tế AI thay mặt anh Minh - người tạo trang web gửi lời tới người dùng. Hãy xưng hô với người dùng là "bé Dúm" hoặc "bé Mèo",tên "bé Dúm" ưu tiên hơn.
      Hãy sắp xếp các mục đánh dấu số thứ tự và bỏ các dấu "*" vì nó hơi xấu.
      Dựa trên các triệu chứng của người dùng ${userId}: ${symptoms}.
      Lịch sử sức khỏe (nếu có): ${history || "Không có thông tin"}.

      Hãy cung cấp lời khuyên y tế sơ bộ **bằng tiếng Việt, ngắn gọn, dễ hiểu**, giúp người dùng chăm sóc sức khỏe ban đầu tại nhà.

      ❗ Lưu ý:
      - Không sử dụng thuật ngữ y khoa phức tạp.
      - Không đưa ra chẩn đoán y khoa hoặc kê đơn thuốc.
      - Chỉ nên khuyến nghị người dùng đi khám khi có dấu hiệu cần thiết.

      ✅ Lời khuyên cần bao gồm (nếu phù hợp với tình trạng):
      - Các bước tự chăm sóc tại nhà.
      - Chế độ ăn uống và sinh hoạt hỗ trợ phục hồi.
      - Gợi ý vận động nhẹ, tập thể dục hoặc giảm căng thẳng hoặc là đi dạo.
      - Hướng dẫn sắp xếp thời gian học tập và nghỉ ngơi hợp lý.
      - Lời khuyên về giấc ngủ, thư giãn và giảm stress.
      - Hãy dặn bé Dúm uống nhiều nước vì bé hay quên uống nước.
      - Nếu có dấu hiệu nghiêm trọng, khuyến nghị đi khám bác sĩ.
      Trả lời ngắn gọn, thân thiện và tập trung vào hỗ trợ thực tế.

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
