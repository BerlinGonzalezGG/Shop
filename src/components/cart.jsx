import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/cartContext";
import { useCurrency } from "@/context/currencyContext";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export default function Cart() {
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [skinTotal, setskinTotal] = useState(0);
  const { currency } = useCurrency();
  const { cart, removeFromCart } = useCart();

  const handleCart = () => {
    setOpen(!open);
  };

  useEffect(() => {
    let newTotal = 0;
    cart.forEach((product) => {
      newTotal += Number(product.price) * product.quantity * currency.price;
    });

    setTotal(newTotal);
  }, [cart]);

  const handleRemoveItem = async (id) => {
    const ProductIndex = cart.findIndex((item) => item.id === id);
    removeFromCart(ProductIndex);
  };

  return (
    <>
      <div
        className="hover:cursor-pointer hover:text-white"
        title="Cart"
        onClick={handleCart}
      >
        <ShoppingBag
          title="Cart"
          className="w-5 h-5 text-gray-400 hover:text-white transition-all"
        />
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog className="relative z-20" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex bg-[#0A0A0A] h-full flex-col overflow-y-scroll shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Shopping cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {cart.length == 0 ? (
                                <p className="mt-4 text-2xl font-semibold flex justify-center">
                                  Cart empty
                                </p>
                              ) : (
                                <>
                                  {cart.map((product) => (
                                    <li key={product.id} className="flex py-6">
                                      <div className="h-24 w-24 relative flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <Image
                                          src={
                                            product.category === "skin"
                                              ? product.image
                                              : product.image.url
                                          }
                                          className="object-cover object-bottom"
                                          fill
                                          alt=""
                                          objectFit="cover"
                                        />
                                      </div>

                                      <div className="ml-4 flex flex-1 flex-col justify-between">
                                        <div>
                                          <div className="flex justify-between text-base font-medium text-gray-900">
                                            <div>
                                              {product.category === "skin" ? (
                                                <Link
                                                  className="hover:underline"
                                                  href={`/shop/${product.id}`}
                                                >
                                                  <h4 className="font-medium text-white">
                                                    {product.name}
                                                  </h4>
                                                </Link>
                                              ) : (
                                                <h4 className="font-medium text-white">
                                                  {product.name}
                                                </h4>
                                              )}

                                              <p className="text-gray-400 text-sm">
                                                Quantity: {product.quantity}
                                              </p>
                                            </div>
                                            <p className="ml-4 text-white">
                                              $
                                              {(
                                                product.price * currency.price
                                              ).toFixed(2)}{" "}
                                              {currency.label}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveItem(product.id)
                                          }
                                          className="font-medium text-gray-400 hover:text-gray-200 text-right text-sm"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-white">
                          <p>Subtotal</p>
                          <p>
                            ${total.toFixed(2)} {currency.label}
                          </p>
                        </div>

                        <p className="mt-0.5 text-sm text-gray-400">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <Link
                            className="flex items-center justify-center rounded-md border border-transparent bg-[#2A2A2A] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-600"
                            href="/checkout"
                          >
                            Checkout
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-400">
                          <p>
                            or
                            <button
                              type="button"
                              className="font-medium text-gray-300 hover:text-gray-200 ml-1"
                              onClick={() => setOpen(false)}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
