"use client";
import { Overview } from "@/components/dashboard/overview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [amount, setAmount] = useState(0);
  const [monthAmount, setMonthAmount] = useState(0);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
        });
        const resJson = await res.json();
        setUsers(resJson.users);

        const filteredOrders = resJson.orders.filter(
          (order) => order.payment.status === true
        );
        setOrders(filteredOrders);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const currentMonthTotal = filteredOrders
          .filter(
            (order) =>
              new Date(order.timestamp).getMonth() === currentMonth &&
              new Date(order.timestamp).getFullYear() === currentYear
          )
          .reduce((acc, order) => {
            const orderTotal = order.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
            // Apply discount if exists
            const discount = order.discount?.value
              ? (order.discount.value / 100) * orderTotal
              : 0;
            return acc + (orderTotal - discount);
          }, 0);

        setMonthAmount(currentMonthTotal.toFixed(2));

        const totalAmount = filteredOrders.reduce((acc, order) => {
          const orderTotal = order.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          // Apply discount if exists
          const discount = order.discount?.value
            ? (order.discount.value / 100) * orderTotal
            : 0;
          return acc + (orderTotal - discount);
        }, 0);

        setAmount(totalAmount.toFixed(2));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  return (
    <main className="flex-1 pt-16 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Hi, Welcome back Berlin👋
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="border rounded shadow-lg px-5 py-4">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="h-4 bg-[#2A2A2A] rounded w-1/4"></div>
                      <div className="h-4 w-4 rounded-full bg-[#2A2A2A]"></div>
                    </div>
                    <div>
                      <div className="h-8 bg-[#2A2A2A] rounded w-1/3 mt-4"></div>
                      <div className="h-4 bg-[#2A2A2A] rounded w-1/2 mt-2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <Card className="bg-black">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Current Month Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${monthAmount}</div>
                    <p className="text-xs text-muted-foreground">
                      The amount you earned this month.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-black">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${amount}</div>
                    <p className="text-xs text-muted-foreground">
                      The total amount you earned.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-black">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Users</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Users who logged in.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-black">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orders.length}</div>
                    <p className="text-xs text-muted-foreground">
                      All sales that were made.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            {loading ? (
              <>
                <Card className="col-span-4 bg-black">
                  <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                      <div className="w-[200px] h-[40px] bg-[#2A2A2A] rounded-lg animate-pulse" />
                      <div className="w-[250px] h-[15px] mt-1 bg-[#2A2A2A] rounded-lg animate-pulse" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-2 sm:p-6">
                    <div className="flex items-end gap-2 justify-center w-full h-full animate-pulse">
                      {Array.from({ length: 40 }, (_, index) => {
                        // Función para generar alturas aleatorias
                        const generateRandomHeight = () => {
                          const heights = [100, 200, 300];
                          return heights[
                            Math.floor(Math.random() * heights.length)
                          ];
                        };

                        return (
                          <div
                            key={index}
                            className="w-10 bg-[#2A2A2A] rounded-md"
                            style={{
                              height: `${generateRandomHeight()}px`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-4 md:col-span-3 bg-black">
                  <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                      <div className="w-[200px] h-[40px] bg-[#2A2A2A] rounded-lg animate-pulse" />
                      <div className="w-[250px] h-[15px] mt-1 bg-[#2A2A2A] rounded-lg animate-pulse" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-8">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={`loading-${index}`}
                          className="flex items-center animate-pulse"
                        >
                          <div className="h-9 w-9 bg-[#2A2A2A] rounded-full" />
                          <div className="ml-4 space-y-1 w-2/4">
                            <div className="h-4 bg-[#2A2A2A] rounded w-1/4" />
                            <div className="h-4 bg-[#2A2A2A] rounded w-1/2" />
                          </div>
                          <div className="ml-auto h-4 bg-[#2A2A2A] rounded w-1/6" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Overview data={orders} />
                <Card className="col-span-4 md:col-span-3 bg-black">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made {orders.length} sales this month.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-8">
                      {orders
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp) - new Date(a.timestamp)
                        )
                        .slice(0, 5)
                        .map((order, index) => (
                          <div className="flex items-center" key={index}>
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src="/images/defaultavatar.png"
                                alt="Avatar"
                              />
                              <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium capitalize leading-none">
                                {order.shipping.email.split("@")[0]}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.shipping.email}
                              </p>
                            </div>
                            <div className="ml-auto font-medium">
                              +$
                              {order.discount?.value
                                ? order.items
                                    .reduce(
                                      (total, item) =>
                                        total +
                                        item.price *
                                          item.quantity *
                                          (1 - order.discount.value / 100) *
                                          order.currency.price,
                                      0
                                    )
                                    .toFixed(2)
                                : order.items
                                    .reduce(
                                      (total, item) =>
                                        total +
                                        item.price *
                                          item.quantity *
                                          order.currency.price,
                                      0
                                    )
                                    .toFixed(2)}{" "}
                              {order.currency.label}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default DashboardPage;
