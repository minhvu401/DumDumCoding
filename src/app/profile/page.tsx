"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../../utils/supabase";

// Define a type for the profile data for better type safety
interface ProfileData {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
}

// Define a specific type for health records
interface HealthRecord {
  weight: number;
  sleep_hours: number;
  energy_level: number;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<HealthRecord[] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch profile.");
        }
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        toast.error(`❌ ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchHistoricalData = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from("health_data")
          .select("weight, sleep_hours, energy_level, created_at")
          .eq("userId", profile.id)
          .order("created_at", { ascending: false })
          .limit(30);

        if (dbError) throw new Error(dbError.message);

        setAnalysis(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Could not fetch health data.";
        toast.error(`❌ ${errorMessage}`);
      }
    };

    fetchHistoricalData();
  }, [profile?.id]);

  const handleUpdate = async () => {
    if (!profile || !token) return;
    try {
      setUpdating(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
          avatar: profile.avatar,
          email: profile.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cập nhật thất bại");
      toast.success("✅ Cập nhật thành công!");
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Cập nhật thất bại";
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-blue-400 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-pink-400 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-pink-100">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
          Hồ sơ của bé
        </h1>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={profile.avatar || "/img/default-avatar.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <input
              type="text"
              name="avatar"
              value={profile.avatar}
              onChange={handleChange}
              placeholder="URL ảnh đại diện"
              className="w-full max-w-xs px-4 py-2 rounded-xl border border-pink-200 text-center"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              value={profile.userName}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white/50 font-medium text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Họ và tên
            </label>
            <input
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-pink-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-pink-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-pink-200"
            />
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="px-8 py-3 bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {updating ? "Đang lưu..." : "Cập nhật hồ sơ"}
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-pink-200">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
            Phân tích sức khỏe
          </h2>
          {analysis ? (
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          ) : (
            <p className="text-center text-gray-500">
              Đang tải dữ liệu phân tích...
            </p>
          )}
        </div>

        <Toaster position="top-right" />
      </div>
    </div>
  );
}
