import DashboardHeader from "@/components/dashboard/dashboard-header";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Dashboard - BerlinGonzalez Shop",
  description: "Basic administration dashboard",
};

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Redirecciona a la página de inicio si no hay sesión o si el rol no es admin
  if (!session || session.user.role !== "admin") {
    return redirect("/");
  }

  await fetch(`${process.env.NEXTAUTH_URL}/api/bot`, {
    method: "GET",
  });

  return (
    <>
      <DashboardHeader />
      <div className="flex h-screen">{children}</div>
    </>
  );
}
