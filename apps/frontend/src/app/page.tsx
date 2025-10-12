import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { CrisisButton } from "@/components/CrisisButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <About />
      </main>
      <Footer />
      <CrisisButton />
    </div>
  );
}
