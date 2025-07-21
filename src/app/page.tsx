import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-200 to-blue-200 rounded-full mb-8 shadow-lg">
              <svg
                className="w-12 h-12 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Chào mừng
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                {" "}
                bé iu{" "}
              </span>
              đến với
              <br />
              không gian của riêng mình
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nơi giúp bé tạo lập lịch học tập, công việc một cách khoa học và
              chăm sóc sức khỏe một cách toàn diện nhất
            </p>

            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                <span>Lịch học thông minh</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                <span>Theo dõi sức khỏe</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-200 rounded-full"></div>
                <span>Chăm sóc bản thân</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:cursor-pointer hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-200 to-pink-300 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Lịch học thông minh
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tạo lịch học tập và làm việc khoa học, phù hợp với nhịp sinh học
                của bé
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:cursor-pointer hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Theo dõi sức khỏe
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ghi chép và theo dõi tình trạng sức khỏe hàng ngày một cách dễ
                dàng
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:cursor-pointer hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-200 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Chăm sóc bản thân
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tạo thói quen tích cực và chăm sóc tinh thần, thể chất một cách
                toàn diện
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-pink-100 via-blue-50 to-pink-100 rounded-3xl p-12 shadow-lg border border-pink-200">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Bắt đầu hành trình chăm sóc bản thân
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Hãy để anh Minh đồng hành cùng bé trong việc xây dựng một cuộc
                sống cân bằng, khỏe mạnh và hạnh phúc. Mỗi ngày là một cơ hội
                mới để bé trở thành phiên bản tốt nhất của chính mình.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg
                  className="w-5 h-5 text-pink-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Đơn giản & Dễ sử dụng</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Cá nhân hóa hoàn toàn</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg
                  className="w-5 h-5 text-pink-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Luôn bên cạnh bé</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-20 h-20 bg-pink-300 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>
      <div
        className="absolute bottom-40 right-10 w-28 h-28 bg-blue-300 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "6s" }}
      ></div>
    </div>
  );
};

export default Home;
