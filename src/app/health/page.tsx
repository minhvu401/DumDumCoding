"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { supabase } from "../../../utils/supabase";
import CustomSelect from "@/components/customSelect/page";
import toast, { Toaster } from "react-hot-toast";
import {
  Activity,
  Heart,
  Brain,
  Moon,
  Sparkles,
  Calendar,
  Weight,
  Zap,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu

interface HealthDataRow {
  id: number;
  userId: string;
  date: string;
  weight: number | null;
  sleepHours: number | null;
  energyLevel: number | null;
  mood: string | null;
  created_at: string;
}

export default function HealPage() {
  const [formData, setFormData] = useState<HealthDataRow>({
    id: 0,
    userId: "8",
    date: new Date().toISOString().split("T")[0],
    weight: 52.0,
    sleepHours: 6.0,
    mood: "Tốt",
    energyLevel: 8,
    created_at: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<HealthDataRow[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    const existingData = historicalData.find((row) => row.date === date);
    if (existingData) {
      setFormData({ ...existingData, created_at: new Date().toISOString() });
      setIsEditing(true);
    } else {
      setFormData({
        ...formData,
        date,
        weight: 0,
        sleepHours: 0,
        mood: "good",
        energyLevel: 0,
        created_at: new Date().toISOString(),
      });
      setIsEditing(false);
    }
  };

  const handleSaveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/health/${formData.userId}`;
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.userId,
          date: formData.date,
          weight: formData.weight,
          sleepHours: formData.sleepHours,
          mood: formData.mood,
          energyLevel: formData.energyLevel,
        }),
      });

      if (!response.ok) throw new Error("Lỗi khi lưu dữ liệu");

      const data = await response.json();
      toast.success(`✅ ${data.message}`);

      const { data: newHistoricalData, error: histErr } = await supabase
        .from("health_data")
        .select(
          "id, userId, date, weight, sleepHours, mood, energyLevel, created_at"
        )
        .eq("userId", formData.userId)
        .order("date", { ascending: false })
        .limit(30);

      if (!histErr && newHistoricalData) {
        setHistoricalData(newHistoricalData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchHistoricalData = async () => {
      try {
        const { data, error } = await supabase
          .from("health_data")
          .select(
            "id, userId, date, weight, sleepHours, mood, energyLevel, created_at"
          )
          .eq("userId", formData.userId)
          .order("date", { ascending: false })
          .limit(30);

        if (error) {
          console.error("Error fetching historical data:", error);
          setError("Lỗi khi tải dữ liệu lịch sử");
          return;
        }

        setHistoricalData(data as HealthDataRow[]);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Lỗi không mong muốn khi tải dữ liệu");
      }
    };

    fetchHistoricalData();
  }, [formData.userId]);

  const handleAIConsult = async () => {
    setLoading(true);
    setError(null);
    try {
      const history = historicalData
        .map(
          (row) =>
            `Ngày ${row.date}: Cân nặng ${row.weight}kg, Ngủ ${row.sleepHours}h, Năng lượng ${row.energyLevel}`
        )
        .join("; ");

      const response = await fetch("/api/your-endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: formData.userId, symptoms, history }),
      });

      if (!response.ok) throw new Error("Lỗi từ AI");

      const data = await response.json();
      setAiAdvice(data.advice);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-cyan-50 to-cyan-100">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Kiểm tra sức khỏe với AI
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Theo dõi và phân tích sức khỏe của Dúm một cách thông minh
          </p>
          <strong className="text-pink-500 mt-8 text-lg font-semibold">
            Dúm nhớ cập nhật sức khỏe hằng ngày nhé 😽
          </strong>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Main Data Input Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-pink-500" />
                {isEditing ? "Cập nhật" : "Nhập"} dữ liệu sức khỏe
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Input - chiếm 2 cột */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    Ngày
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="border-2 border-gray-200 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 font-medium text-gray-800"
                  />
                </div>

                {/* Weight */}
                <div className="flex flex-col h-full">
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Weight className="w-4 h-4 text-cyan-500" />
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="border-2 border-gray-200 rounded-xl p-4 w-full h-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 font-medium text-gray-800"
                    placeholder="Nhập cân nặng"
                  />
                </div>

                {/* Sleep Hours */}
                <div className="flex flex-col h-full">
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    Giờ ngủ
                  </label>
                  <input
                    type="number"
                    name="sleepHours"
                    value={formData.sleepHours || ""}
                    onChange={handleChange}
                    min="0"
                    max="24"
                    step="0.1"
                    className="border-2 border-gray-200 rounded-xl p-4 w-full h-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 font-medium text-gray-800"
                    placeholder="Số giờ ngủ"
                  />
                </div>

                {/* Mood */}
                <div className="flex flex-col h-full">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    😊 Cảm xúc
                  </label>
                  <CustomSelect
                    value={formData.mood || "good"}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, mood: val }))
                    }
                  />
                </div>

                {/* Energy Level */}
                <div className="flex flex-col h-full">
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Mức năng lượng
                  </label>
                  <input
                    type="number"
                    name="energyLevel"
                    value={formData.energyLevel || ""}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    className="border-2 border-gray-200 rounded-xl p-4 w-full h-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 font-medium text-gray-800"
                    placeholder="Từ 0 đến 10"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8">
                <button
                  onClick={handleSaveData}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {isEditing ? "Cập nhật dữ liệu" : "Lưu dữ liệu"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Consultation Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl px-12 py-5 border border-cyan-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-500" />
                AI Tư vấn
              </h3>

              <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-400 to-pink-500 font-semibold mb-6 text-sm leading-relaxed">
                Dúm hãy sử dụng AI để kiểm tra sức khỏe của mình nhé! Nhớ nhập
                triệu chứng cụ thể để AI phân tích cho bé
              </p>

              <button
                onClick={() => setIsAIModalOpen(true)}
                className="w-full mb-3.5 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-500 hover:to-cyan-500 transition-all duration-300 shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                AI kiểm tra cho Dúm
              </button>

              {/* Recent Data Summary */}
              {historicalData
                .filter((data) => {
                  const today = new Date();
                  const recordDate = new Date(data.date);
                  const diffTime = today.getTime() - recordDate.getTime();
                  const diffDays = diffTime / (1000 * 60 * 60 * 24);
                  return diffDays <= 7;
                })
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 3)
                .map((data) => (
                  <div
                    key={data.id}
                    className="text-gray-600 flex flex-col leading-tight"
                  >
                    <span
                      className="text-[13px] mb-0.2 mt-2
                     font-medium text-gray-500"
                    >
                      {new Date(data.date).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                    <span className="font-medium text-[14px] text-gray-700">
                      Cân nặng {data.weight}kg • Giờ ngủ {data.sleepHours}h •
                      Năng lượng {data.energyLevel}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* AI Consultation Modal */}
        {isAIModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-pink-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3 flex-shrink-0">
                <Brain className="w-8 h-8 text-purple-600" />
                AI hỗ trợ cho Dúm
              </h2>

              <div className="flex-1 overflow-y-auto space-y-6">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Nhập triệu chứng (ví dụ: đau đầu, sốt...)"
                  className="border-2 border-gray-200 rounded-xl p-4 w-full h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-medium text-gray-800 resize-none"
                />

                {aiAdvice && (
                  <div className="p-4 bg-pink-100 border-l-4 border-pink-200 rounded-lg max-h-64 overflow-y-auto">
                    <h3 className="font-bold text-cyan-800 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Lời khuyên cho Dúm:
                    </h3>
                    <div className="text-cyan-800 font-medium whitespace-pre-wrap leading-relaxed">
                      {aiAdvice}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-800 font-semibold">{error}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 flex-shrink-0">
                <button
                  onClick={handleAIConsult}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang tư vấn...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Kiểm tra cho Dúm
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsAIModalOpen(false)}
                  className="flex-1 bg-gray-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              color: "#1f2937",
              fontWeight: "600",
            },
          }}
        />
      </div>
    </div>
  );
}
