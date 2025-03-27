import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";

export const metadata = {
  title: "About",
};

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-gray-50 ">
      <Navbar />
      <main className="flex-1 max-xl:pt-20 xl:flex-row flex-col-reverse min-h-screen w-full container flex items-center justify-center">
        <div className="flex flex-col w-6/12">
          <h3 className="text-5xl font-semibold">About</h3>
          <p>
            Don't overpay to get the best Fortnite products. Buy the latest
            skins aswell as Fortnite Crew or Packs with safe delivery.
          </p>
        </div>
        <div className="w-full sm:w-[500px] max-xl:mb-4">
          <Image
            alt="Hero Product"
            className="mx-auto overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            src="/images/aboutImage.png"
            width={600}
            height={600}
            loading="eager"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
