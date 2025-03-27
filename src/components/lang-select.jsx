import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Image from "next/image";

const LangSelect = () => {
  return (
    <Select defaultValue="en">
      <SelectTrigger className="w-full md:w-[90px] h-[35px]">
        <SelectValue placeholder="Lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/*
                    <SelectItem value="es">
            <div className="flex items-center text-xs">
              <Image
                src="/flags/ar-flag.webp"
                className="w-6 mr-2"
                alt=""
                width={24}
                height={24}
              />{" "}
              ES
            </div>
          </SelectItem>
          */}
          <SelectItem value="en">
            <div className="flex items-center text-xs">
              <Image
                src="/flags/us-flag.webp"
                className="w-6 mr-2"
                alt=""
                width={24}
                height={24}
              />{" "}
              EN
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LangSelect;
