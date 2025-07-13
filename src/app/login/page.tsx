"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Login failed");
    } else {
      setError("");
      // Có thể lưu thông tin user nếu cần: localStorage, cookie, zustand, etc.
      // localStorage.setItem('user', JSON.stringify(result.user))

      router.push("/"); // chuyển hướng đến trang chủ hoặc dashboard
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen ml-7 p-5 bg-[url('/img/backgrounddumdum.jpg')]"
      style={{
        width: "1522px",
        height: "500px",
        top: "109px",
        left: "-30px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute", // Cần cho pseudo-element
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
          opacity: 0.7, // Độ mờ 70%
          zIndex: 0, // Đặt dưới nội dung
          pointerEvents: "none", // Không chặn tương tác với nội dung
        }}
      />
      <div
        className="lg:w-1/2 p-50 lg:p-50 flex flex-col justify-center"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl text-center font-bold text-black mb-5 mr-14">
            Đăng nhập
          </h1>
          <div className="space-y-6">
            <form
              onSubmit={handleLogin}
              className="flex justify-center flex-col gap-4 w-full max-w-sm"
            >
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
                    placeholder="Tên đăng nhập"
                    className="block w-full pl-10 pr-3 text-black py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:font-bold"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <div className="flex items-center">
                  <div className="absolute pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="block text-black w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-cyan-600 hover:text-cyan-500 transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <button
                type="submit"
                style={{ cursor: "pointer" }}
                className="bg-gradient-to-r bg-pink-300 text-white px-4 py-2 rounded-[7px] hover:bg-pink-500 transition"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
