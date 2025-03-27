import Image from "next/image";
import Link from "next/link";

const HomeSection = () => {
  return (
    <section className=" min-h-screen flex flex-col justify-center text-gray-400 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col-reverse items-center">
        <div className="lg:flex-grow max-md:mt-4 md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font font-black sm:text-6xl text-3xl mb-2 text-white">
            Cheap V-Bucks and Skins. Directly and safe into your own account.
          </h1>
          <p className="mb-4 text-lg leading-relaxed ">
            Don’t overspend trying to get your favorite skins. You don’t need to
            spend hundreds of dollars on V-Bucks to have awesome skins.
          </p>
          <div className="flex justify-center">
            <Link
              href="/shop"
              className="text-white transition-all text-sm bg-[#0088CC] border-0 py-3 px-8 focus:outline-none hover:bg-[#0088CC]/80 rounded"
            >
              Shop now
            </Link>
            <Link
              href="/bot"
              className="ml-4 text-sm transition-all text-white border-[#0088CC] border-2 py-3 px-8 focus:outline-none bg-[#0A0A0A] hover:bg-[#0088CC] hover:text-white rounded"
            >
              Add our BOTS
            </Link>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <Image
            alt="Hero Product"
            className="mx-auto overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            src="/images/skin.webp"
            width={550}
            height={550}
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
