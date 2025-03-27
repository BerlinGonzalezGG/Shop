import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import OrderCard from "@/components/order-card";
import { connectDB } from "@/lib/mongo";
import Order from "@/lib/models/order";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Orders",
};

const getOrders = async () => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return;
    }

    const orders = await Order.find({
      "shipping.email": session.user.email,
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

const OrdersPage = async () => {
  const orders = await getOrders();
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-gray-50 ">
      <Navbar />
      <main className="flex-1 py-20 xl:py-32 w-full flex flex-col items-center justify-start gap-4">
        {orders.length === 0 ? (
          <p>No orders</p>
        ) : (
          orders.map((o, index) => <OrderCard o={o} key={index} />)
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
