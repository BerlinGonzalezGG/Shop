"use client";
import { useEffect, useState } from "react";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import Image from "next/image";
import { ShoppingCart, Truck, Save, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Spin from "@/components/spin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { getCsrfToken } from "next-auth/react";
import { getShop } from "@/helpers/shop";

const OrderViewPage = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);
  const [sentLoadingMap, setSentLoadingMap] = useState({});
  const [botsData, setBotsData] = useState([]);
  const { toast } = useToast();

  const breadcrumbItems = [
    { title: "Orders", link: "/dashboard/orders" },
    {
      title: `Order #${params.id.slice(-5).toUpperCase()}`,
      link: `/dashboard/orders/view/${params.id}`,
    },
  ];

  const sendGift = async (offerId, price, receiverId) => {
    try {
      setBotsData([]);
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({
          offerId,
          price,
          receiverId,
        }),
      });
      const resJson = await res.json();
      setSentLoadingMap((prevMap) => ({ ...prevMap, [offerId]: false }));

      if (resJson.message) {
        toast({
          title: "Error",
          description: resJson.message,
        });
        return;
      }

      if (Array.isArray(resJson) && resJson.length >= 1) {
        setBotsData(resJson);
        setSecondDialogOpen(true);
        return;
      }

      if (resJson.status === 200) {
        toast({
          title: "Success",
          description: `Skin sent to ${receiverId}`,
        });
      }

      const itemIndex = order.items.findIndex(
        (item) => item.offerId === offerId
      );
      if (itemIndex !== -1) {
        order.items[itemIndex].delivered = true;
      } else {
        toast({
          title: "Error",
          description: `No item found with offerId: ${offerId}`,
        });
        return;
      }

      const skinItems = order.items.filter(
        (item) => item.category === "skin" && item.delivered === true
      );

      const body = {
        items: order.items,
      };

      if (skinItems.length === order.items.length) {
        body.status = true;
      }

      const resGiftSent = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify(body),
      });

      const updatedOrderData = await resGiftSent.json();
      setOrder(updatedOrderData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send gift",
      });
      console.error("Gift sending error:", error);
    }
  };

  const getData = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const response = await res.json();
        console.log(response);
        setOrder(response);
      } else {
        toast({
          title: "Error",
          description: "Failed to load order data",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load order data",
      });
      console.error("Order data fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, [params.id]);

  const handleRetryOrder = async (item) => {
    const offerId = item.offerId;
    const shop = await getShop();
    const p = shop.shop.find((e) => e.mainId === item.id);
    if (!p) {
      toast({
        title: "Error",
        description: `${item.name} not in shop today`,
      });
      return;
    }
    setSentLoadingMap((prevMap) => ({ ...prevMap, [offerId]: true }));
    await sendGift(
      offerId,
      p.price.finalPrice,
      order.shipping.fortnite.username
    );
  };

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const handleEditClick = (key, currentValue) => {
    setEditingField(key);
    setTempValue(currentValue);
  };

  const handleSaveClick = async (key) => {
    const keys = key.split(".");

    // Clonamos el objeto `order` para evitar mutaciones directas
    const updatedOrder = { ...order };

    // Utilizamos el array de claves para navegar por el objeto y actualizar el valor correcto
    let tempObject = updatedOrder.shipping;
    for (let i = 0; i < keys.length - 1; i++) {
      tempObject = tempObject[keys[i]];
    }
    tempObject[keys[keys.length - 1]] = tempValue;

    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify(updatedOrder),
      });

      if (res.ok) {
        const updatedOrderData = await res.json();
        setOrder(updatedOrderData);
        setEditingField(null);
        toast({
          title: "Success",
          description: `Field updated`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update the order",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the order",
      });
      console.error("Order update error:", error);
    }
  };

  return (
    <main className="flex-1 pt-16">
      <div className="flex-1 space-y-4 p-4 h-fit pb-4 pt-6 md:p-8 mb-10">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`Order #${params.id
              .slice(-5)
              .toUpperCase()}`}</h2>
            <p className="text-sm text-muted-foreground">Manage orders.</p>
          </div>
        </div>
        <Separator />
        <Sheet open={secondDialogOpen} onOpenChange={setSecondDialogOpen}>
          <SheetContent className="w-screen sm:max-w-[80vw] lg:max-w-[60vw] xl:max-w-[500px] overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Gift status</SheetTitle>
              <SheetDescription>Status of the gift</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bot</TableHead>
                    <TableHead>State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {botsData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{data.bot}</TableCell>
                      <TableCell>
                        {data.status === 28015
                          ? "Gift limit reached"
                          : data.status === 28014
                          ? "Not friends or not for 2 days"
                          : data.status === 12720
                          ? "Insufficient V-Bucks"
                          : data.status === 10000
                          ? "Token error"
                          : data.status === 28004
                          ? "Not MFA"
                          : data.status === 28001
                          ? "Not in store today"
                          : "Unknown"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSecondDialogOpen(false)}
            >
              Close
            </Button>
          </SheetContent>
        </Sheet>
        {loading ? (
          <Spin className="w-10 h-10" />
        ) : (
          <div className="flex-1 h-full flex flex-col">
            <div className="flex items-center w-full justify-between space-x-2">
              <div className="w-6/12">
                <Card className="bg-[#111]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-bold">Order details</CardTitle>
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
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p>Customer</p>
                        <p className="text-sm">{order.shipping.email}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Phone</p>
                        <p className="text-sm">{order.shipping.phone}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Created at</p>
                        <p className="text-sm">
                          {new Date(order.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: false,
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Status</p>
                        <p className="text-sm capitalize">
                          {order.status === true ? "Success" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="w-6/12 h-full">
                <Card className="h-full bg-[#111]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-bold">Payment</CardTitle>
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
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p>Method</p>
                        <p className="text-sm capitalize">
                          {order.payment.method}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>ID</p>
                        <p
                          title={order.payment.id}
                          className="text-sm truncate w-[200px]"
                        >
                          {order.payment.id}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Status</p>
                        <p className="text-sm capitalize">
                          {order.payment.status === true
                            ? "Success"
                            : "Pending"}
                        </p>
                      </div>
                      {order.discount?.value ? (
                        <div className="flex items-center justify-between">
                          <p>Total</p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm text-gray-400">
                              Coupon: {order.discount.coupon}
                            </p>
                            <p className="text-sm text-gray-400 line-through">
                              $
                              {order.items
                                .reduce(
                                  (total, item) =>
                                    total +
                                    item.price *
                                      item.quantity *
                                      order.currency.price,
                                  0
                                )
                                .toFixed(2)}
                            </p>
                            <p className="text-sm">
                              $
                              {order.items
                                .reduce(
                                  (total, item) =>
                                    total +
                                    item.price *
                                      item.quantity *
                                      (1 - order.discount.value / 100) *
                                      order.currency.price,
                                  0
                                )
                                .toFixed(2)}{" "}
                              {order.currency.label}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p>Total</p>
                          <p className="text-sm">
                            $
                            {order.items
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
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-1.5 w-full">
              <Card className="bg-[#111]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-bold">Delivery details</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {Object.entries(order.shipping).map(([key, value]) => {
                      if (key === "phone" || key === "email") {
                        return null;
                      }
                      if (typeof value === "object" && value !== null) {
                        // Asumimos que es un objeto simple con propiedades que deseas mostrar
                        return (
                          <div
                            key={key}
                            className="flex flex-col gap-2 rounded-sm"
                          >
                            <h4 className="text-lg font-semibold capitalize">
                              {key}
                            </h4>
                            <Separator />
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div
                                key={subKey}
                                className="flex items-center justify-between"
                              >
                                <p>{subKey}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm capitalize">
                                    {typeof subValue === "boolean"
                                      ? subValue.toString()
                                      : subValue}
                                  </p>
                                  {editingField === `${key}.${subKey}` ? (
                                    <>
                                      <input
                                        type="text"
                                        value={tempValue}
                                        onChange={(e) =>
                                          setTempValue(e.target.value)
                                        }
                                        className="bg-black px-2 py-2 rounded text-sm"
                                      />
                                      <Save
                                        className="w-4 h-4 text-gray-400 hover:cursor-pointer hover:text-white transition-all"
                                        onClick={() =>
                                          handleSaveClick(`${key}.${subKey}`)
                                        }
                                      />
                                    </>
                                  ) : (
                                    <Pencil
                                      className="w-3.5 h-3.5 text-gray-400 hover:cursor-pointer hover:text-white transition-all"
                                      onClick={() =>
                                        handleEditClick(
                                          `${key}.${subKey}`,
                                          subValue
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                            <div className="flex items-center gap-2">
                              {editingField === key ? (
                                <>
                                  <input
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) =>
                                      setTempValue(e.target.value)
                                    }
                                    className="bg-gray-800 p-1 rounded text-sm"
                                  />
                                  <Save
                                    className="w-4 h-4 text-gray-400 hover:cursor-pointer hover:text-white transition-all"
                                    onClick={() => handleSaveClick(key)}
                                  />
                                </>
                              ) : (
                                <>
                                  <p className="text-sm capitalize">
                                    {typeof value === "boolean"
                                      ? value.toString()
                                      : value}
                                  </p>
                                  <Pencil
                                    className="w-3.5 h-3.5 text-gray-400 hover:cursor-pointer hover:text-white transition-all"
                                    onClick={() => handleEditClick(key, value)}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-1.5 flex-1 w-full">
              <Card className="bg-[#111]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-bold">Items</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col mt-4">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-start">
                            <Image
                              src={
                                item.category === "skin"
                                  ? item.image
                                  : item.image.url
                              }
                              width={100}
                              height={100}
                              className="object-cover"
                            />
                            <div className="ml-2">
                              <p className="font-bold text-lg">{item.name}</p>
                              <p className="text-gray-400 text-sm">
                                Quantity: x{item.quantity}
                              </p>
                              {item.category === "skin" && (
                                <>
                                  <div
                                    className={`${
                                      !item.delivered ? "flex items-center" : ""
                                    }`}
                                  >
                                    <p
                                      className={`${
                                        !item.delivered ? "mr-2" : "mb-1"
                                      } text-gray-300 text-sm`}
                                    >
                                      Delivered:
                                    </p>
                                    <Switch
                                      checked={item.delivered}
                                      onCheckedChange={async (e) => {
                                        // Actualizamos el item con el nuevo estado 'delivered'
                                        const updatedItem = {
                                          ...item,
                                          delivered: e,
                                        };

                                        // Actualizamos el estado local 'order'
                                        setOrder((prevOrder) => {
                                          const updatedItems =
                                            prevOrder.items.map((p) =>
                                              p.id === item.id ? updatedItem : p
                                            );

                                          // Realizamos el fetch dentro del setOrder para asegurar que usamos el estado actualizado
                                          (async () => {
                                            const res = await fetch(
                                              `/api/orders/${prevOrder._id}`,
                                              {
                                                method: "PUT",
                                                headers: {
                                                  "Content-Type":
                                                    "application/json",
                                                },
                                                body: JSON.stringify({
                                                  items: updatedItems,
                                                }),
                                              }
                                            );

                                            if (res.ok) {
                                              toast({
                                                title: "Success",
                                                description: `Item ${
                                                  e
                                                    ? "delivered"
                                                    : "not delivered"
                                                }`,
                                              });
                                            } else {
                                              console.log(
                                                "Error updating the order"
                                              );
                                            }
                                          })();

                                          // Retornamos el nuevo estado
                                          return {
                                            ...prevOrder,
                                            items: updatedItems,
                                          };
                                        });
                                      }}
                                    />
                                  </div>
                                  {!item.delivered &&
                                    order.payment.status === true && (
                                      <Button
                                        variant="secondary"
                                        className="h-[30px]"
                                        type="button"
                                        disabled={sentLoadingMap[item.offerId]}
                                        onClick={() => handleRetryOrder(item)}
                                      >
                                        {sentLoadingMap[item.offerId] ? (
                                          <Spin className="w-5 h-5" />
                                        ) : (
                                          "Retry"
                                        )}
                                      </Button>
                                    )}
                                </>
                              )}
                            </div>
                          </div>
                          <p className="font-semibold text-md">
                            $
                            {(
                              item.price *
                              item.quantity *
                              order.currency.price
                            ).toFixed(2)}{" "}
                            {order.currency.label}
                          </p>
                        </div>
                        {index < order.items.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderViewPage;
