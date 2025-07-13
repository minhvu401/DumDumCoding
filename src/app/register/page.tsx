"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Phone, UserCircle, Image } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    role: "user",
    avatar: "",
    status: true,
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Tạo tài khoản thành công!");
      setForm({
        userName: "",
        password: "",
        email: "",
        phoneNumber: "",
        fullName: "",
        role: "user",
        avatar: "",
        status: true,
      });
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(`❌ ${data.error || "Lỗi khi tạo tài khoản"}`);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen p-5 bg-[url('/img/backgrounddumdum.jpg')]"
      style={{
        width: "1550px",
        height: "500px", // Tăng chiều cao để chứa form
        top: "109px", // Dời form lên trên 200px (từ 109px xuống -90px)
        left: "-30px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
      }}
    >
      <div
        style={{
          width: "1522px",
          height: "500px",
          top: "109px",
          left: "-30px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.7,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        className="lg:w-1/2 p-8 lg:p-2 flex flex-col justify-center"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="max-w-md mx-auto mr-25 mb-5 w-full">
          <h1 className="text-3xl text-center font-bold text-black mb-5 mr-16">
            Đăng ký tài khoản
          </h1>
          <div className="space-y-4">
            {" "}
            {/* Giảm space-y từ 6 xuống 4 */}
            <form
              onSubmit={handleSubmit}
              className="flex justify-center flex-col gap-3 w-full max-w-sm" // Giảm gap từ 4 xuống 3
            >
              {/* Tên đăng nhập */}
              <div className="relative items-center">
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên đăng nhập
                </label>
                <div className="flex items-center">
                  <div className="absolute pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="userName"
                    placeholder="Tên đăng nhập"
                    className="block w-full pl-10 pr-3 text-black py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:font-bold"
                    value={form.userName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu
                </label>
                <div className="flex items-center">
                  <div className="absolute pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    className="block text-black w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:font-bold"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Họ tên */}
              <div className="relative">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ tên
                </label>
                <div className="flex items-center">
                  <div className="absolute pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Họ tên"
                    className="block text-black w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:font-bold"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="flex items-center">
                  <div className="absolute pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="block text-black w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:font-bold"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="relative">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </label>
                <div className="flex items-center">
                  <div className="absolute pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Số điện thoại"
                    className="block text-black w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:font-bold"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Avatar */}
              <div className="relative">
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ảnh đại diện (tùy chọn)
                </label>
                <div className="flex items-center">
                  <div className="absolute pl-3 flex items-center pointer-events-none">
                    <Image className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="avatar"
                    placeholder="Link ảnh đại diện"
                    className="block text-black w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:font-bold"
                    value={form.avatar}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Điều khoản */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-blue-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Tôi đồng ý với{" "}
                  <a
                    href="#"
                    className="text-cyan-600 hover:text-cyan-500 transition-colors"
                  >
                    điều khoản sử dụng
                  </a>
                </label>
              </div>

              <button
                type="submit"
                style={{ cursor: "pointer" }}
                className="bg-gradient-to-r bg-pink-300 text-white px-4 py-2 rounded-[7px] hover:bg-pink-500 transition mt-2"
              >
                Tạo tài khoản
              </button>
            </form>
            {/* Thông báo */}
            {message && (
              <div className="mt-3 text-center">
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
            {/* Link đến trang login */}
            <div className="text-center mr-22 mt-3">
              <p className="text-sm text-gray-700">
                Đã có tài khoản?{" "}
                <a
                  href="/login"
                  className="text-cyan-600 hover:text-cyan-500 transition-colors font-medium"
                >
                  Đăng nhập ngay
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
