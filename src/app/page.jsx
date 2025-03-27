import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HomeSection from "@/components/sections/home-section";
import ShopSection from "@/components/sections/shop-section";
import ChargesSection from "@/components/sections/charges-section";
import FaqSection from "@/components/sections/faq-section";
import StepSection from "@/components/sections/step-section";
import WppWidget from "@/components/wpp-widget";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-gray-50">
      <Navbar />
      <main className="flex-1">
        <HomeSection />
        <WppWidget />
        <ShopSection />
        <ChargesSection />
        <StepSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
