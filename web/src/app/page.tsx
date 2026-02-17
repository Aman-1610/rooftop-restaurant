import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MenuHighlights from "@/components/MenuHighlights";
import Testimonials from "@/components/Testimonials";
import GalleryPreview from "@/components/GalleryPreview";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-50 relative overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <MenuHighlights />
      <Testimonials />
      <GalleryPreview />
      <Contact />
      <Footer />
    </main>
  );
}
