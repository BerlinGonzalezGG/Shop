"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/cartContext";
import { CurrencyProvider } from "@/context/currencyContext";

const Providers = ({ children }) => {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <CartProvider>{children}</CartProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
};

export default Providers;
