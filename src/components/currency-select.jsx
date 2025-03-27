import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/context/currencyContext";
import Image from "next/image";

const CurrencySelect = () => {
  const { currencies, currency, changeCurrency } = useCurrency();
  const handleChangeCurrency = (c) => {
    changeCurrency(c);
  };

  return (
    <div>
      <Select
        onValueChange={(e) => handleChangeCurrency(e)}
        defaultValue={currency.value}
      >
        <SelectTrigger className="w-full md:w-[120px] h-[35px]">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {currencies.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                <div className="flex  items-center text-xs h-6">
                  <Image
                    src={currency.flag}
                    className="mr-2"
                    alt=""
                    width={24}
                    height={24}
                  />
                  {currency.label}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelect;
