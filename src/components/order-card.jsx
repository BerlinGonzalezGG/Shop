import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const OrderCard = ({ o }) => {
  const timestamp = new Date(o.timestamp).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <Card className="w-5/12 bg-black">
      <CardHeader>
        <CardTitle>Order #{o._id.toString().slice(-6).toUpperCase()}</CardTitle>
        <CardDescription>{timestamp}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" text-sm text-gray-400">
          <p>
            Status:{" "}
            <span className="capitalize">
              {o.status == true ? "Success" : "Pending"}
            </span>
          </p>
          <p>
            Payment method:{" "}
            <span className="capitalize">{o.payment.method}</span>
          </p>
          <p>
            Payment status: {o.payment.status == true ? "Success" : "Pending"}
          </p>
          <p>Customer email: {o.shipping.email}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">View more</Button>
          </SheetTrigger>
          <SheetContent className="max-w-screen sm:max-w-[800px]">
            <SheetHeader>
              <SheetTitle>View order</SheetTitle>
              <SheetDescription>Inspecting order</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="table-cell">Status</TableHead>
                    <TableHead className="table-cell">Amount</TableHead>
                    <TableHead className="table-cell">Payment method</TableHead>
                    <TableHead className="table-cell">Payment status</TableHead>
                    <TableHead className="table-cell">Created at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium table-cell capitalize">
                      {o.status == true ? "Success" : "Pending"}
                    </TableCell>

                    <TableCell className="table-cell">
                      ${" "}
                      {o.payment.method === "stripe"
                        ? (
                            (o.items.reduce(
                              (total, item) =>
                                total + item.price * item.quantity,
                              0
                            ) +
                              parseFloat(
                                (o.items.reduce(
                                  (total, item) =>
                                    total + item.price * item.quantity,
                                  0
                                ) *
                                  2.9) /
                                  100 +
                                  0.3
                              )) *
                            o.currency.price
                          ).toFixed(2)
                        : (
                            o.items.reduce(
                              (total, item) =>
                                total + item.price * item.quantity,
                              0
                            ) * o.currency.price
                          ).toFixed(2)}{" "}
                      {o.currency.label}
                    </TableCell>

                    <TableCell className="table-cell capitalize">
                      {o.payment.method}
                    </TableCell>

                    <TableCell className="table-cell capitalize">
                      {o.payment.status == true ? "Success" : "Pending"}
                    </TableCell>

                    <TableCell className="table-cell">{timestamp}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Accordion type="single" collapsible className="mb-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Products</AccordionTrigger>
                  <AccordionContent>
                    <ul
                      role="list"
                      className="-my-6 divide-y divide-gray-200 overflow-y-scroll pr-2"
                    >
                      {o.items.map((product) => (
                        <li key={product.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              src={
                                product.category === "skin"
                                  ? product.image
                                  : product.image.url
                              }
                              className="h-full w-full object-cover object-center"
                              alt="Product Image"
                              width={100}
                              height={100}
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a className="text-white" href={product.href}>
                                    {product.name}
                                  </a>
                                  <p className="text-gray-300">
                                    x{product.quantity}
                                  </p>
                                </h3>
                                <p className="ml-4 text-white">
                                  $
                                  {o.discount && o.discount.value != 0
                                    ? (
                                        ((100 - o.discount.value) *
                                          (product.price *
                                            product.quantity *
                                            o.currency.price)) /
                                        100
                                      ).toFixed(2)
                                    : (
                                        product.price *
                                        product.quantity *
                                        o.currency.price
                                      ).toFixed(2)}{" "}
                                  {o.currency.label}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
