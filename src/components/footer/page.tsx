import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-300 via-cyan-500 to-cyan-400 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">DUM DUM</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Chúng tôi cam kết mang đến những sản phẩm và dịch vụ tốt nhất cho
              khách hàng với chất lượng cao nhất.
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
                  href="/services"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Blog
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

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/return"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  Chính sách đổi trả
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
                <span className="text-white/80 text-sm">Dum Dum's home</span>
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

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Đăng ký nhận tin tức
              </h4>
              <p className="text-white/80 text-sm">
                Nhận thông tin cập nhật mới nhất về sản phẩm và dịch vụ của
                chúng tôi
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
              />
              <button className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-white/80 text-sm">
            © 2025 Dum Dum. Tất cả quyền được bảo lưu. | Thiết kế bởi{" "}
            <Link
              href="https://www.facebook.com/MinKy.vuminh/"
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              Vũ Minh của Dum
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
