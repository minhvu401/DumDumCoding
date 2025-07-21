/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatarfiles.alphacoders.com",
        port: "", // Để trống vì sử dụng cổng mặc định (443 cho HTTPS)
        pathname: "/**", // Cho phép tất cả đường dẫn từ domain này
      },
    ],
  },
};

module.exports = nextConfig;
