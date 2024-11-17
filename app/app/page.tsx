"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Radio, Headphones, Music } from "lucide-react";
import Link from "next/link";
import { Appbar } from "./components/Appbar";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/compat/router";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect immediately after session is available
  useEffect(() => {
    if (session) {
      router?.push("/dashboard");
    }
  }, [session, router]);

  const handleSignUp = () => {
    // Initiates Google sign-in and redirects to /dashboard upon success
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 bg-gray-900">
      <Appbar></Appbar>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white max-w-3xl">
                Let Your Fans Choose the Beat
              </h1>
              <p className="mt-4 mx-auto max-w-[700px] text-gray-200 md:text-xl">
                Empower your audience to curate your music stream. Connect with
                fans like never before.
              </p>
              <div className="flex gap-4 mt-8 justify-center">
                <Button
                  className="bg-purple-600 text-white hover:bg-purple-700 min-w-[120px]
                "
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 min-w-[120px]"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Users className="w-12 h-12 text-purple-300" />
                <h3 className="text-xl font-bold text-white">
                  Fan Interaction
                </h3>
                <p className="text-gray-200">Let fans choose the music.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Radio className="w-12 h-12 text-purple-300" />
                <h3 className="text-xl font-bold text-white">Live Streaming</h3>
                <p className="text-gray-200">Stream with real-time input.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Headphones className="w-12 h-12 text-purple-300" />
                <h3 className="text-xl font-bold text-white">
                  High-Quality Audio
                </h3>
                <p className="text-gray-200">Crystal clear sound quality.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 px-4 md:px-6">
        <div className="container mx-auto flex justify-center">
          <ScrollToTopButton></ScrollToTopButton>
        </div>
      </footer>
    </div>
  );
}

/*import Image from "next/image";
import { Appbar } from "./components/Appbar";

export default function Home() {
  return (
    <>
    <Appbar></Appbar>
    </>

  );
}  */
