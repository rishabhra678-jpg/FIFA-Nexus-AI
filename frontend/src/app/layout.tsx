"use client";

import "@/styles/globals.css";
import React from "react";
import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html lang="en">
      <head>
        <title>FIFA Nexus AI – Stadium Intelligence Copilot</title>
        <meta name="description" content="GenAI-enabled command dashboard and intelligence cockpit for the FIFA World Cup 2026 stadium management and fan experience." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@500;700;900&display=swap" rel="stylesheet" />
        <style>{`
          body {
            font-family: 'Inter', sans-serif;
          }
          h1, h2, h3, .font-tech {
            font-family: 'Orbitron', sans-serif;
          }
        `}</style>
      </head>
      <body>
        {isLandingPage ? (
          <div className="min-h-screen bg-background">{children}</div>
        ) : (
          <Layout>{children}</Layout>
        )}
      </body>
    </html>
  );
}
