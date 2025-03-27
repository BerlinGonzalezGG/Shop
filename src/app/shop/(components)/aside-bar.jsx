"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const AsideBar = ({ filteredGrouped }) => {
  const [openItem, setOpenItem] = useState(null);

  // Función para manejar el cambio de estado
  const handleOpenChange = (value) => {
    setOpenItem(openItem === value ? null : value);
  };

  return (
    <aside className="max-md:absolute max-md:left-0 md:fixed md:-ml-4 z-50 top-[130px] md:top-1/2 transform max-md:z-40 md:-translate-y-1/2 group w-full h-[45px] md:h-fit md:w-[45px] group transition-all hover:h-fit md:hover:w-[450px] bg-black border backdrop-blur md:p-4 md:rounded-2xl max-md:flex max-md:items-center max-md:justify-center">
      <div className="flex w-auto group-hover:w-full flex-row group-hover:flex-col md:flex-col gap-4 justify-center group-hover:py-4 items-center md:py-4">
        {Object.entries(filteredGrouped).map(([category, subcategories]) => {
          const safeCategory = category !== "null" ? category : "extra";

          return (
            <div
              key={safeCategory}
              className="w-full flex flex-col items-center group-hover:w-11/12"
            >
              <div className="w-[8px] h-[8px] rounded-full bg-[#81909A] group-hover:hidden md:mb-2" />
              <Accordion
                type="single"
                collapsible
                onValueChange={handleOpenChange}
                className="hidden group-hover:block transition-all duration-500 ease-in-out w-full"
              >
                <AccordionItem value={safeCategory}>
                  <AccordionTrigger
                    className={`${
                      openItem == safeCategory
                        ? "bg-[#111416] rounded-t-xl"
                        : "rounded-xl"
                    } text-white border-4 border-transparent hover:border-white transition-all justify-between font-extrabold w-full text-sm px-5 py-2.5 inline-flex items-center`}
                  >
                    {safeCategory.toUpperCase()}
                  </AccordionTrigger>
                  <AccordionContent className="z-10 transition-all duration-700 ease-in-out bg-[#111416] rounded-b-xl shadow w-full">
                    <ul className="px-2 text-white w-full">
                      {Object.keys(subcategories).map((subcategory) => (
                        <li
                          key={subcategory}
                          className="w-full flex flex-col gap-2"
                        >
                          <Link
                            href={`#${subcategory}`}
                            className=" p-2 rounded-xl uppercase border-4 transition-all hover:border-white border-transparent font-extrabold text-left w-full"
                          >
                            {subcategory}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default AsideBar;
