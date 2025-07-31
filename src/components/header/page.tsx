"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../assets/cinnamoroll.png";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// Kiểu dữ liệu user từ token
interface TokenPayload {
  userName: string;
  role: string;
  fullName: string;
  avatar?: string;
}

export default function Header() {
  const [animate, setAnimate] = useState(false);
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // Refs để đóng dropdown khi click ra ngoài
  const avatarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 3000);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAvatarOpen(false);
    window.location.reload();
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setIsAvatarOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-pink-300 via-cyan-500 to-cyan-340 text-white shadow-md">
      <div className="max-w-9x2 px-5 py-1 flex">
        {/* Logo */}
        <div className="flex mr-30 items-center">
          <Link href="/">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className={`cursor-pointer transition-transform duration-[3000ms] ease-in-out 
                ${animate ? "scale-x-[-1] translate-x-[650px]" : ""} 
                hover:scale-x-[-1] hover:translate-x-[650px]`}
            />
          </Link>
        </div>

        {/* Menu giữa */}
        <div className="flex-1 flex items-center justify-center gap-5 ml-35">
          {/* ✅ Dropdown "Không gian riêng" */}
          <div className="relative" ref={menuRef}>
            <button
              className="text-bases font-semibold cursor-pointer px-4 py-0 hover:opacity-60 transition hover:scale-108"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              Không gian riêng
            </button>
            {isMenuOpen && (
              <div className="absolute top-full mt-2 flex flex-col bg-white text-black rounded-md shadow-sm mr-7 z-5 min-w-[157px]">
                <Link
                  href="/schedule"
                  className="px-4 py-2 rounded-t-md hover:bg-gray-100 hover:rounded-t-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Lịch học của bé
                </Link>
                <Link
                  href="/health"
                  className="px-4 py-2 text-left rounded-b-md hover:bg-gray-100 hover:rounded-b-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sức khỏe
                </Link>
              </div>
            )}
          </div>

          <button
            className="text-bases font-semibold cursor-pointer px-4 py-0 hover:opacity-60 transition hover:scale-108"
            onClick={() => router.push("/message")}
          >
            Lời nhắn cho bé
          </button>
        </div>

        {/* Phải: avatar hoặc login/register */}
        <div className="flex gap-2 justify-center items-center">
          {user ? (
            // ✅ Avatar dropdown
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setIsAvatarOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <Image
                  src={user.avatar || "/img/default-avatar.png"}
                  alt="Avatar"
                  width={45}
                  height={45}
                  className="rounded-full border-2 border-white shadow-md cursor-pointer hover:opacity-80 transition hover:scale-120"
                />
              </button>

              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 flex flex-col bg-white text-black rounded-md shadow-md z-10 min-w-[150px]">
                  <Link
                    href="/profile"
                    className="px-4 py-2 hover:bg-gray-100 hover:rounded-t-md transition"
                    onClick={() => setIsAvatarOpen(false)}
                  >
                    Trang cá nhân
                  </Link>
                  <button
                    className="px-4 py-2 text-left hover:bg-gray-100 hover:rounded-b-md transition"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Chưa đăng nhập
            <>
              <Link href="/login">
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-pink-100">
                  Đăng nhập
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-pink-100">
                  Đăng kí
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
