import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="contact" className="text-gray-400 bg-black body-font ">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap justify-start lg:justify-center text-left">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 max-md:mb-4">
            <h5 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              OUR PRODUCTS
            </h5>
            <nav className="list-none" />
            <li>
              <a className="text-gray-400 hover:text-white">Skins</a>
            </li>
            <li>
              <a className="text-gray-400 hover:text-white">Crew</a>
            </li>
            <li>
              <a className="text-gray-400 hover:text-white">V-Bucks</a>
            </li>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h5 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              MORE INFORMATION
            </h5>
            <nav className="list-none mb-10">
              <li>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/terms`}
                  className="text-gray-400 hover:text-white"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/privacy`}
                  className="text-gray-400 hover:text-white"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="https://bit.ly/4fqnvx1"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  Berlin Gonzalez Clothes
                </a>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h5 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              CONTACT US
            </h5>
            <nav className="list-none mb-10">
              <li>
                <a
                  href="mailto:support@berlingonzalez.shop"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  E-Mail
                </a>
              </li>
              <li className="text-gray-400 hover:text-white">
                Discord: berlingonzalez
              </li>
              <li>
                <a
                  href="https://wa.me/message/VDGK6VB4GAYFB1"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-[#0A0A0A]">
        <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path
                d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="ml-3">
              <span className=" text-xl font-bold">BerlinGonzalez Shop</span>
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} BerlinGonzalez Shop, LLC.
              </p>
            </div>
          </a>
          <Link
            href="https://audens.ar"
            target="_blank"
            className="flex items-center max-sm:mt-2 sm:ml-4 sm:flex-row flex-col gap-1 hover:cursor-pointer"
          >
            <p className="text-sm text-gray-300 text-center">Developed by</p>
            <Image
              alt="Audens Solutions"
              src="https://audens.ar/brand/text-logo-white.png"
              width={100}
              height={10}
            />
          </Link>
          <span className="inline-flex items-center gap-3 sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a
              href="https://www.tiktok.com/@berlingonzalezz"
              target="_blank"
              className="text-gray-400 hover:text-white transition-all"
            >
              <svg
                width={20}
                height={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"
                />
              </svg>
            </a>
            <a
              href="https://www.twitch.tv/berlingonzalezs"
              target="_blank"
              className="text-gray-400 hover:text-white transition-all"
            >
              <svg
                width={20}
                height={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M391.2 103.5H352.5v109.7h38.6zM285 103H246.4V212.8H285zM120.8 0 24.3 91.4V420.6H140.1V512l96.5-91.4h77.3L487.7 256V0zM449.1 237.8l-77.2 73.1H294.6l-67.6 64v-64H140.1V36.6H449.1z"
                />
              </svg>
            </a>
            <a
              href="https://kick.com/berlingonzalez"
              target="_blank"
              className="text-gray-400 hover:text-white transition-all"
            >
              <svg
                width={22}
                height={22}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM320.8 233l-23.3 23.1L320.8 279c24.1 23.9 24.1 63 0 86.9s-63.4 23.9-87.6 0l-8.5-8.4c-11.3 16-29.7 26.5-50.9 26.5c-34.1 0-61.9-27.5-61.9-61.4l0-133.2c0-33.8 27.7-61.4 61.9-61.4c21.1 0 39.6 10.5 50.9 26.5l8.5-8.4c24.1-23.9 63.4-23.9 87.6 0s24.1 63 0 86.9z"
                />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@BerlinGonzalez"
              target="_blank"
              className="text-gray-400 hover:text-white transition-all"
            >
              <svg
                width={25}
                height={25}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path
                  fill="currentColor"
                  d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
                />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
