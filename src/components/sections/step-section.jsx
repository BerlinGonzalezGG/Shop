import Image from "next/image";
import Link from "next/link";

const StepSection = () => {
  return (
    <section
      id="steps"
      className="min-h-screen  flex flex-col justify-center body-font"
    >
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="w-full hidden xl:flex text-white max-xl:mt-10 mt-3 mb-12 justify-center items-center">
          <h4 className="font-semibold md:text-5xl text-3xl">
            How does it works?
          </h4>
        </div>
        <div className="flex w-full justify-between flex-col-reverse xl:flex-row text-gray-400">
          <div className="lg:w-2/5 md:w-1/2 mx-auto md:pr-10 md:py-6 max-lg:pb-10">
            <div className="w-full xl:hidden text-white flex max-xl:mt-10 mt-3 mb-12 justify-center items-center">
              <h4 className="font-semibold md:text-5xl text-3xl">
                How does it works?
              </h4>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-[#2A2A2A] pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A1A1A] inline-flex items-center justify-center text-white relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#ffffff"
                  fill="none"
                >
                  <path
                    d="M19 16V14C19 11.1716 19 9.75736 18.1213 8.87868C17.2426 8 15.8284 8 13 8H11C8.17157 8 6.75736 8 5.87868 8.87868C5 9.75736 5 11.1716 5 14V16C5 18.8284 5 20.2426 5.87868 21.1213C6.75736 22 8.17157 22 11 22H13C15.8284 22 17.2426 22 18.1213 21.1213C19 20.2426 19 18.8284 19 16Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 18C20.4142 18 21.1213 18 21.5607 17.5607C22 17.1213 22 16.4142 22 15C22 13.5858 22 12.8787 21.5607 12.4393C21.1213 12 20.4142 12 19 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 18C3.58579 18 2.87868 18 2.43934 17.5607C2 17.1213 2 16.4142 2 15C2 13.5858 2 12.8787 2.43934 12.4393C2.87868 12 3.58579 12 5 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.5 3.5C13.5 4.32843 12.8284 5 12 5C11.1716 5 10.5 4.32843 10.5 3.5C10.5 2.67157 11.1716 2 12 2C12.8284 2 13.5 2.67157 13.5 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 5V8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 13V14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 13V14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 17.5C10 17.5 10.6667 18 12 18C13.3333 18 14 17.5 14 17.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h5 className="font-medium title-font text-sm text-white mb-1 tracking-wider">
                  STEP 1
                </h5>
                <p className="leading-relaxed">
                  Make sure to be friends with our bots for at least 48hs before
                  buying!{" "}
                  <Link
                    href="/bot"
                    className="underline underline-offset-4 hover:text-gray-200 transition-all hover:cursor-pointer"
                  >
                    Click here
                  </Link>{" "}
                  to be added.
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-[#2A2A2A] pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A1A1A] inline-flex items-center justify-center text-white relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#ffffff"
                  fill="none"
                >
                  <path
                    d="M2.9668 10.4956V15.4974C2.9668 18.3268 2.9668 19.7415 3.84548 20.6205C4.72416 21.4996 6.13837 21.4996 8.9668 21.4996H14.9668C17.7952 21.4996 19.2094 21.4996 20.0881 20.6205C20.9668 19.7415 20.9668 18.3268 20.9668 15.4974V10.4956"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.9668 17.9932H10.9668"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10.1038 8.41799C9.82182 9.43639 8.79628 11.1931 6.84777 11.4477C5.12733 11.6725 3.82246 10.9216 3.48916 10.6076C3.12168 10.353 2.28416 9.53823 2.07906 9.02903C1.87395 8.51983 2.11324 7.41657 2.28416 6.96678L2.96743 4.98839C3.13423 4.49147 3.5247 3.31617 3.92501 2.91864C4.32533 2.52111 5.13581 2.50381 5.4694 2.50381H12.4749C14.2781 2.52929 18.2209 2.48774 19.0003 2.50382C19.7797 2.5199 20.2481 3.17324 20.3848 3.4533C21.5477 6.27012 22 7.88334 22 8.57075C21.8482 9.30407 21.22 10.6868 19.0003 11.295C16.6933 11.9271 15.3854 10.6976 14.9751 10.2257M9.15522 10.2257C9.47997 10.6245 10.4987 11.4274 11.9754 11.4477C13.4522 11.4681 14.7273 10.4378 15.1802 9.92013C15.3084 9.76737 15.5853 9.31419 15.8725 8.41799"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </div>
              <div className="flex-grow pl-4">
                <h5 className="font-medium title-font text-sm text-white mb-1 tracking-wider">
                  STEP 2
                </h5>
                <p className="leading-relaxed">
                  Choose the skin you want from the store's daily rotation.{" "}
                  <Link
                    href="/shop"
                    className="underline underline-offset-4 hover:text-gray-200 transition-all hover:cursor-pointer"
                  >
                    Click here
                  </Link>{" "}
                  for Shop.
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-[#2A2A2A] pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A1A1A] inline-flex items-center justify-center text-white relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#ffffff"
                  fill="none"
                >
                  <path
                    d="M2 12C2 8.46252 2 6.69377 3.0528 5.5129C3.22119 5.32403 3.40678 5.14935 3.60746 4.99087C4.86213 4 6.74142 4 10.5 4H13.5C17.2586 4 19.1379 4 20.3925 4.99087C20.5932 5.14935 20.7788 5.32403 20.9472 5.5129C22 6.69377 22 8.46252 22 12C22 15.5375 22 17.3062 20.9472 18.4871C20.7788 18.676 20.5932 18.8506 20.3925 19.0091C19.1379 20 17.2586 20 13.5 20H10.5C6.74142 20 4.86213 20 3.60746 19.0091C3.40678 18.8506 3.22119 18.676 3.0528 18.4871C2 17.3062 2 15.5375 2 12Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 16H11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5 16L18 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 9H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h5 className="font-medium title-font text-sm text-white mb-1 tracking-wider">
                  STEP 3
                </h5>
                <p className="leading-relaxed">
                  Pay in your country's currency with our secure payment
                  methods.
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-[#2A2A2A] pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A1A1A] inline-flex items-center justify-center text-white relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#ffffff"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="18"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="7"
                    cy="18"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 17.9724C3.90328 17.9178 3.2191 17.7546 2.73223 17.2678C2.24536 16.7809 2.08222 16.0967 2.02755 15M9 18H15M19 17.9724C20.0967 17.9178 20.7809 17.7546 21.2678 17.2678C22 16.5355 22 15.357 22 13V11H17.3C16.5555 11 16.1832 11 15.882 10.9021C15.2731 10.7043 14.7957 10.2269 14.5979 9.61803C14.5 9.31677 14.5 8.94451 14.5 8.2C14.5 7.08323 14.5 6.52485 14.3532 6.07295C14.0564 5.15964 13.3404 4.44358 12.4271 4.14683C11.9752 4 11.4168 4 10.3 4H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 8H8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 11H6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5 6H16.3212C17.7766 6 18.5042 6 19.0964 6.35371C19.6886 6.70742 20.0336 7.34811 20.7236 8.6295L22 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h5 className="font-medium title-font text-sm text-white mb-1 tracking-wider">
                  STEP 4
                </h5>
                <p className="leading-relaxed">
                  Restart your Fortnite and receive your Gift in your account
                  from our bots.
                </p>
              </div>
            </div>
            <div className="flex relative">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A1A1A] inline-flex items-center justify-center text-white relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#ffffff"
                  fill="none"
                >
                  <path
                    d="M16.002 13.5C16.002 14.3284 16.6735 15 17.502 15C18.3304 15 19.002 14.3284 19.002 13.5C19.002 12.6716 18.3304 12 17.502 12C16.6735 12 16.002 12.6716 16.002 13.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2.00195 11C2.00195 7.22876 2.00195 5.34315 3.17353 4.17157C4.3451 3 6.23072 3 10.002 3H14.002C14.9319 3 15.3969 3 15.7784 3.10222C16.8137 3.37962 17.6223 4.18827 17.8997 5.22354C18.002 5.60504 18.002 6.07003 18.002 7M10.002 7H16.002C18.8304 7 20.2446 7 21.1233 7.87868C22.002 8.75736 22.002 10.1716 22.002 13V15C22.002 17.8284 22.002 19.2426 21.1233 20.1213C20.2446 21 18.8304 21 16.002 21H12.5005"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 17H6M6 17H2M6 17V21M6 17L6 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>{" "}
              </div>
              <div className="flex-grow pl-4">
                <h5 className="font-medium title-font text-sm text-white mb-1 tracking-wider">
                  FINISH
                </h5>
                <p className="leading-relaxed">
                  Take advantage and spend less money buying items from
                  Fortnite.
                </p>
              </div>
            </div>
          </div>
          <Image
            className="max-xl:mx-auto max-md:w-10/12 max-xl:pb-10"
            src="/images/skin2.webp"
            width={660}
            loading="lazy"
            height={100}
            alt="step"
          />
        </div>
      </div>
    </section>
  );
};

export default StepSection;
