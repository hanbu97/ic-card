"use client";
import HomeTop from "components/homeTop";
import HomeContent from "components/homeContent";

export default function Home() {
  return (
    <main className="dark bg-black flex flex-col items-center justify-start min-h-screen">
      <HomeTop />
      <HomeContent />
    </main>
  )
}
