import React from "react";
import Header from "@/components/ra/Header";
import Hero from "@/components/ra/Hero";
import ValuesCards from "@/components/ra/ValuesCards";
import Generators from "@/components/ra/Generators";
import About from "@/components/ra/About";
import Contact from "@/components/ra/Contact";
import Footer from "@/components/ra/Footer";
import MobileTabBar from "@/components/ra/MobileTabBar";

export default function Home() {
  return (
    <div className="relative min-h-screen max-w-full overflow-x-hidden bg-background pb-16 md:pb-0">
      <Header />
      <main>
        <Hero />
        <ValuesCards />
        <Generators />
        <About />
        <Contact />
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}