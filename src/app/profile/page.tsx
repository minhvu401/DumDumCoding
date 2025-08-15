"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import {
  Camera,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  UserCheck,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Define types based on backend API response
interface ProfileData {
  userId: number;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  status: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);

    const fetchProfile = async () => {
      try {
        setError(null);
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch profile.");
        }
        const data = await res.json();
        setProfile(data);
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

  const handleUpdate = async () => {
    if (!profile || !token) return;
    try {
      setUpdating(true);
      setError(null);

      // NOTE: Server PUT expects FormData in current implementation.
      const form = new FormData();
      form.append("fullName", profile.fullName || "");
      form.append("phoneNumber", profile.phoneNumber || "");
      // Avatar is already uploaded via Supabase Storage and we pass URL separately on server through PUT handler logic.
      // If you want to upload file directly via API, attach a File object here.

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Cập nhật thất bại");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("✅ Cập nhật thành công!");
      } else {
        toast.success("✅ Cập nhật thành công! Nhưng chưa có token mới!");
      }

      if (data.user) {
        setProfile(data.user);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Cập nhật thất bại";
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({
        ...profile,
        [e.target.name]: e.target.value,
      } as ProfileData);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !profile) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `avatar_${profile.userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("❌ Lỗi khi tải ảnh lên");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    if (urlData?.publicUrl) {
      setProfile({ ...profile, avatar: urlData.publicUrl });
      toast.success("✅ Tải ảnh thành công, bấm lưu để cập nhật!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="w-4 h-4" />;
      case "inactive":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const handleChangePassword = async () => {
    if (!token) return;

    // Client-side validations
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("❌ Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("❌ Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("❌ Xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setChangingPwd(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Đổi mật khẩu thất bại");
      }

      toast.success("✅ Đổi mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Đổi mật khẩu thất bại";
      toast.error(`❌ ${message}`);
    } finally {
      setChangingPwd(false);
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

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 font-medium">
            Không tìm thấy thông tin hồ sơ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-pink-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            {"Hồ sơ của bé"}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                profile.status
              )}`}
            >
              {getStatusIcon(profile.status)}
              {profile.status}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Profile fields */}
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Image
                src={profile.avatar || "/img/default-avatar.png"}
                alt="Avatar"
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/img/default-avatar.png";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-pink-400 rounded-full p-2 shadow-lg"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                hidden
              />
            </div>

            <div className="w-full max-w-xs">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {"URL ảnh đại diện"}
              </label>
              <input
                type="url"
                name="avatar"
                value={profile.avatar || ""}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2 rounded-xl border border-pink-200 text-center focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-pink-500" />
                {"Tên đăng nhập"}
              </label>
              <input
                value={profile.userName}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-gray-50 font-medium text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {"Tên đăng nhập không thể thay đổi"}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {"Họ và tên"}
              </label>
              <input
                name="fullName"
                value={profile.fullName || ""}
                onChange={handleChange}
                placeholder="Nhập họ và tên đầy đủ"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                {"Email"}
              </label>
              <input
                type="email"
                value={profile.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-gray-50 font-medium text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {"Email không thể thay đổi"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                {"Số điện thoại"}
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="px-8 py-3 bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            {updating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {"Đang lưu..."}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {"Cập nhật hồ sơ"}
              </>
            )}
          </button>
        </div>

        {/* ĐỔI MẬT KHẨU */}
        <div className="mt-10 border-t border-pink-100 pt-8">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {"Đổi mật khẩu"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Old Password */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {"Mật khẩu cũ"}
              </label>
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowOld((v) => !v)}
                className="absolute right-3 top-[45px] text-gray-500"
                aria-label="Hiện/ẩn mật khẩu cũ"
                title="Hiện/ẩn mật khẩu cũ"
              >
                {showOld ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {"Mật khẩu mới"}
              </label>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 8 ký tự"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-[45px] text-gray-500"
                aria-label="Hiện/ẩn mật khẩu mới"
                title="Hiện/ẩn mật khẩu mới"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {"Xác nhận mật khẩu"}
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-[45px] text-gray-500"
                aria-label="Hiện/ẩn xác nhận mật khẩu"
                title="Hiện/ẩn xác nhận mật khẩu"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-5 ">
            <button
              onClick={handleChangePassword}
              disabled={changingPwd}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 hover:scale-105 disabled:bg-gray-300 text-white font-semibold shadow transition-colors"
            >
              {changingPwd ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
            </button>
          </div>
        </div>
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
  );
}
