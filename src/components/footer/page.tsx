import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-300 via-cyan-500 to-cyan-300 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-75">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">DUM DUM</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Chúng tôi cam kết mang đến những sản phẩm và tình yêu tốt nhất cho
              em bé với chất lượng cao nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Lịch làm việc
                </Link>
              </li>
              <li>
                <Link
                  href="/health"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Sức khỏe
                </Link>
              </li>
              <li>
                <Link
                  href="/message"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Tin tức
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              Thông tin liên hệ
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-white/80 text-sm">
                  Dum Dum&apos;s home
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-white/80 text-sm">+84 773 155 075</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-white/80 text-sm">
                  nhunguyen5904@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-white/80 text-sm">
            © 2025 Dum Dum. Tất cả quyền được bảo lưu. | Thiết kế bởi{" "}
            <Link
              href="https://www.facebook.com/MinKy.vuminh/"
              className="text-lime-200 hover:text-lime-400 transition-colors duration-200"
            >
              Vũ Minh của Dúm
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
