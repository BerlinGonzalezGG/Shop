import Image from "next/image";
import UserAuthForm from "./(components)/user-auth-form";

export const metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <div className="bg-[#0A0A0A] lg:flex hidden items-center justify-center h-full w-6/12">
        <Image
          width={300}
          height={100}
          alt="logo"
          src="/images/minilogo.webp"
        />
      </div>
      <div className="bg-[#1A1A1A] h-full w-full lg:w-6/12 flex flex-col items-center justify-center">
        <UserAuthForm />
      </div>
    </div>
  );
};

export default LoginPage;
