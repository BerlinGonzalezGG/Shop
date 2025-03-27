import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BotForm from "@/components/bot-form";
import { getAccounts } from "../api/accounts/route";
import { getShop } from "../api/shop/route";
import Image from "next/image";

export const metadata = {
  title: "Bot",
};
export const dynamic = "force-dynamic";

const BotPage = async () => {
  const accounts = await getAccounts();
  const shop = await getShop();
  const outfits = shop.shop.filter((e) => e.displayType === "Outfit");
  const obtenerOutfitAleatorio = () =>
    outfits[Math.floor(Math.random() * outfits.length)];

  const sortedAccounts = accounts.successAccounts.sort(
    (a, b) => b.gifts - a.gifts
  );
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-gray-50 ">
      <Navbar />
      <main className="flex-1 max-xl:pt-20 xl:flex-row flex-col-reverse container min-h-screen flex items-center justify-center">
        <div className="mx-auto max-xl:mb-10 max-md:w-11/12">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Add our bots
            </h1>
            <p className="max-w-[600px] text-gray-400 text-sm">
              Due to Epic Games policies, you must be friend with our bot
              accounts for 48hs to be able to receive your first gift. After
              that, all the gifts you buy are instantly delivered. Put your
              username below so our bot accounts send a friend request. Don't
              for get to accept them!
            </p>
            <BotForm />
          </div>
          <div className="flex flex-col gap-2 overflow-y-scroll h-[310px] mt-4 pr-2">
            {sortedAccounts &&
              sortedAccounts.length > 0 &&
              sortedAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 rounded-lg border-2"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        obtenerOutfitAleatorio()?.granted?.[0]?.images
                          ?.icon_background || "/images/noSkin.webp" // fallback image if something is missing
                      }
                      alt="Fortnite image"
                      width="50"
                      height="50"
                      className="rounded-full"
                    />

                    <div className="flex flex-col">
                      <p className="text-sm">{account.bot}</p>
                      <p className="text-gray-400 text-xs font-semibold">
                        {account.gifts} gifts availables
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2.5 h-2.5 ${
                        account.gifts > 0 ? "bg-green-500" : "bg-red-600"
                      } rounded-full`}
                    />
                    <p
                      className={`text-sm ${
                        account.gifts > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {account.gifts > 0 ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="w-full sm:w-[500px] max-xl:mb-4">
          <Image
            alt="Hero Product"
            className="mx-auto overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            src="/images/botImage.png"
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
export default BotPage;
