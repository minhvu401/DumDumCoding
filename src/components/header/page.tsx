"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../assets/cinnamoroll.png"; // 👈 đảm bảo đường dẫn đúng

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-pink-300 via-cyan-500 to-cyan-340 text-white shadow-md">
      <div className="max-w-7x1 px-2 gap-x-270 py-1 flex">
        {/* Logo + Home */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className="cursor-pointer"
            />
          </Link>
          <Link href="/">
            <span className="text-lg font-semibold cursor-pointer hover:underline">
              Trang chủ
            </span>
          </Link>
        </div>

        {/* Nút login / register */}
        <div className="flex gap-5 justify-center items-center">
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
        </div>
      </div>
    </header>
  );
}
