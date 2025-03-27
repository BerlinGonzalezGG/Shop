"use client";
import { createContext, useState, useContext, useEffect } from "react";
const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currencies, setcurrencies] = useState([]);
  const [currency, setcurrency] = useState({
    value: "usd",
    label: "USD",
    price: 1
  });

  const getCurrencies = async () => {
    const res = await fetch("/api/currency");
    const data = await res.json();
    setcurrencies(data);
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  const changeCurrency = (c) => {
    const selectedCurrency = currencies.find(
      (currency) => currency.value === c
    );
    if (selectedCurrency) {
      setcurrency(selectedCurrency);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currencies, currency, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
