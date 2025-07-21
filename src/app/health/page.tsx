"use client";

import { useEffect, useState } from "react";

// Kiểu dữ liệu cho phản hồi từ AI
interface Analysis {
  status: string;
  trends: { [key: string]: number };
  suggestions: string[];
}

export default function HealPage() {
  const [formData, setFormData] = useState({
    userId: "8",
    date: new Date().toISOString().split("T")[0],
    weight: "",
    sleepHours: "",
    mood: "",
    energyLevel: "",
  });

  const [isExistingData, setIsExistingData] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchTodayData = async () => {
    try {
      const response = await fetch(`/api/health/${formData.userId}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        console.log("Chưa có dữ liệu hôm nay");
        setIsExistingData(false);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        weight: data.weight ?? "",
        sleepHours: data.sleepHours ?? "",
        mood: data.mood ?? "",
        energyLevel: data.energyLevel ?? "",
      }));

      setIsExistingData(true);
    } catch (err: any) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu hôm nay");
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const method = isExistingData ? "PUT" : "POST";
      const res = await fetch(`/api/health/${formData.userId}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Lỗi server");

      setMessage(isExistingData ? "Cập nhật thành công" : "Tạo mới thành công");
      setIsExistingData(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nhập dữ liệu sức khỏe hôm nay</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded bg-white shadow"
      >
        <div className="mb-4">
          <label className="block mb-1">Cân nặng (kg)</label>
          <input
            type="number"
            name="weight"
            placeholder="VD: 70.5"
            value={formData.weight}
            onChange={handleChange}
            className="border p-2 w-full placeholder:font-semibold"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Giờ ngủ</label>
          <input
            type="number"
            name="sleepHours"
            placeholder="VD: 7.5"
            value={formData.sleepHours}
            onChange={handleChange}
            className="border p-2 w-full placeholder:font-semibold"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Cảm xúc</label>
          <select
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">-- Chọn --</option>
            <option value="good">Tốt</option>
            <option value="normal">Bình thường</option>
            <option value="bad">Tệ</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Mức năng lượng (0-10)</label>
          <input
            type="number"
            name="energyLevel"
            placeholder="VD: 7"
            value={formData.energyLevel}
            onChange={handleChange}
            min="0"
            max="10"
            className="border p-2 w-full placeholder:font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Đang lưu..." : isExistingData ? "Cập nhật" : "Tạo mới"}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && (
        <div className="text-green-600 mb-4 font-semibold">{message}</div>
      )}

      {analysis && (
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Phân tích AI</h2>
          <p>
            <strong>Trạng thái:</strong> {analysis.status}
          </p>
          <h3 className="mt-2">Xu hướng:</h3>
          <ul>
            {Object.entries(analysis.trends).map(([key, value]) => (
              <li key={key}>
                {key.replace("_", " ")}: {Number(value).toFixed(2)}
              </li>
            ))}
          </ul>
          <h3 className="mt-2">Gợi ý:</h3>
          <ul>
            {analysis.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
