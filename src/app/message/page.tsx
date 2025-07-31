"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  MessageCircle,
  Heart,
  Calendar,
  User,
  Info,
  Megaphone,
  Sparkles,
  Clock,
  Star,
  Filter,
  RefreshCw,
} from "lucide-react";

interface DailyMessage {
  id: number;
  title: string;
  content: string;
  messageDate: string;
  createdBy: string;
  priority: "Thấp" | "Bình thường" | "Quan trọng" | "Cấp bách";
  category: "general" | "health" | "reminder" | "announcement";
  createdAt: string;
  isRead: boolean;
  isFavorited: boolean;
  readAt: string | null;
}

interface CurrentUser {
  userId: number;
  userName: string;
  fullName: string;
}

export default function DailyMessagesPage() {
  const [messages, setMessages] = useState<DailyMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const router = useRouter();

  const fetchMessages = async (date?: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const params = new URLSearchParams();
      if (date) params.append("date", date);
      params.append("limit", "20");

      const res = await fetch(`/api/daily-messages?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch messages");
      }

      const data = await res.json();
      setMessages(data.messages || []);
      setCurrentUser(data.currentUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (messageId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/daily-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId,
          action: "mark_read",
        }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, isRead: true, readAt: new Date().toISOString() }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleToggleFavorite = async (messageId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/daily-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId,
          action: "toggle_favorite",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, isFavorited: data.isFavorited, isRead: true }
              : msg
          )
        );
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Cấp bách":
        return "bg-red-100 text-red-800 border-red-200";
      case "Quan trọng":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Bình thường":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Thấp":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health":
        return <Heart className="w-4 h-4" />;
      case "reminder":
        return <Clock className="w-4 h-4" />;
      case "announcement":
        return <Megaphone className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "text-pink-600";
      case "reminder":
        return "text-cyan-600";
      case "announcement":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredMessages = messages.filter((message) => {
    if (filterCategory !== "all" && message.category !== filterCategory)
      return false;
    if (showOnlyFavorites && !message.isFavorited) return false;
    return true;
  });

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-300 border-t-pink-400 mx-auto mb-4"></div>
          <p className="text-cyan-600 font-medium">Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-2xl from-cyan-100 to-pink-200 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-300 to-pink-300 rounded-full mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Lời nhắn dặn dò
          </h1>
          <p className="text-gray-600 text-lg">
            Tin nhắn yêu thương từ Minh iu mỗi ngày
          </p>
          {currentUser && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <User className="w-4 h-4 text-cyan-600" />
              <span className="font-medium text-gray-700">
                {currentUser.fullName}
              </span>
              {unreadCount > 0 && (
                <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-cyan-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-2 border-cyan-200 rounded-lg px-3 py-2 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                />
                <button
                  onClick={() => fetchMessages(selectedDate)}
                  className="bg-cyan-400 text-white px-4 py-2 rounded-lg hover:bg-cyan-500 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Lọc
                </button>
              </div>

              <button
                onClick={() => fetchMessages()}
                className="bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tất cả
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border-2 border-pink-200 rounded-lg px-3 py-2 focus:border-pink-400"
              >
                <option
                  value="all"
                  className=" text-cyan-800 border-1 border-pink-200 rounded-lg"
                >
                  Tất cả danh mục
                </option>
                <option
                  value="general"
                  className=" text-cyan-800 border-1 border-pink-200 rounded-lg"
                >
                  Chung
                </option>
                <option
                  value="health"
                  className=" text-cyan-800 border-1 border-pink-200 rounded-lg"
                >
                  Sức khỏe
                </option>
                <option
                  value="reminder"
                  className=" text-cyan-800 border-1 border-pink-200 rounded-lg"
                >
                  Nhắc nhở
                </option>
                <option
                  value="announcement"
                  className=" text-cyan-800 border-1 border-pink-200 rounded-lg"
                >
                  Thông báo
                </option>
              </select>

              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  showOnlyFavorites
                    ? "bg-yellow-400 text-white"
                    : "bg-white border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                }`}
              >
                <Star className="w-4 h-4" />
                Yêu thích
              </button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có tin nhắn nào
              </h3>
              <p className="text-gray-500">
                Hãy thử thay đổi bộ lọc hoặc chọn ngày khác
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:scale-102 p-6 border transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  message.isRead
                    ? "border-gray-200"
                    : "border-cyan-400 border-3 bg-cyan-50"
                }`}
                onClick={() => !message.isRead && handleMarkRead(message.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getCategoryColor(
                        message.category
                      )}`}
                    >
                      {getCategoryIcon(message.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {message.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Từ: {message.createdBy}</span>
                        <span>•</span>
                        <span>
                          {new Date(message.messageDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        {!message.isRead && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-600 font-medium">
                              Chưa đọc
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        message.priority
                      )}`}
                    >
                      {message.priority}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(message.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        message.isFavorited
                          ? "bg-yellow-400 text-white hover:bg-yellow-500"
                          : "bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                {message.readAt && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Đã đọc: {new Date(message.readAt).toLocaleString("vi-VN")}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

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
