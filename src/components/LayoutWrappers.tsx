"use client";

import { usePathname } from "next/navigation";
import Header from "./header/page";
import Footer from "./footer/page";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideLayout && <Header />}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
