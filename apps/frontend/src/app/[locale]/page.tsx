import { About } from '@/components/About';
import { CrisisButton } from '@/components/CrisisButton';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';

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
