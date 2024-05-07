// layout.tsx
"use client";
import { Karla } from "next/font/google";
import { useState } from "react";
import Header from "../components/header";
import PageWrapper from "../components/pagewrapper";
import Sidebar from "../components/sidebar";
import "./globals.css";
import { AuthContextProvider, useAuthContext } from "@/AuthContext"; // Import AuthContextProvider and useAuthContext

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-karla",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={karla.className}>
        <AuthContextProvider>
          <InnerLayout>{children}</InnerLayout>
        </AuthContextProvider>
      </body>
    </html>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthContext(); // Get user from AuthContext

  return (
    <div>
      {user && ( // Render sidebar, header, and page wrapper only when user is signed in
        <div className="flex min-h-screen">
          <Sidebar></Sidebar>
          <Header></Header>
          <PageWrapper>{children}</PageWrapper>
        </div>
      )}
    </div>
  );
}
