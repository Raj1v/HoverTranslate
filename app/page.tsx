"use client";
import Main from "@/app/main";
import Footer from "@/app/components/Footer";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <>
      <Main className="max-w-6xl mx-auto pt-20" />
      <Footer />
      <Toaster />
    </>
  );
}
