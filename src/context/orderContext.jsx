"use client";
import { createContext, useState, useContext } from "react";
const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setorder] = useState({
    payment: {},
    currency: {},
    shipping: {},
    discount: {},
    status: "",
    timestamp: "",
    items: {}
  });

  return (
    <OrderContext.Provider value={{ order, setorder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
