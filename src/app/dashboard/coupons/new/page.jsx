"use client";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Spin from "@/components/spin";
import { getCsrfToken } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NewCategoryPage = ({ params }) => {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [expires, setExpires] = useState(null);
  const [uses, setUses] = useState(0);
  const [paramsLoading, setParamsLoading] = useState(false);
  const [vbucks, setVbucks] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("00:00");

  const router = useRouter();

  const getData = useCallback(async () => {
    try {
      const res = await fetch(`/api/coupon/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch coupon data");

      const response = await res.json();
      if (response) {
        setCode(response.code);
        setExpires(response.expires);
        setUses(response.uses);
        setDiscount(response.discount);
        if (response.expires) {
          const parsedDate = parseISO(response.expires);
          setDate(parsedDate);
          setTime(parsedDate.toTimeString().slice(0, 5));
        }
      }
    } catch (error) {
      console.error("Error fetching coupon data:", error);
      toast({
        title: "Error",
        description: "Could not fetch coupon data.",
      });
    } finally {
      setParamsLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    if (params.id) {
      setParamsLoading(true);
      getData();
    }
  }, [params.id, getData]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      return toast({
        title: "Error",
        description: "Code cannot be empty",
      });
    }

    try {
      const res = await fetch(
        params.id ? `/api/coupon/${params.id}` : "/api/coupon",
        {
          method: params.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await getCsrfToken(),
          },
          body: JSON.stringify({
            code,
            expires: date,
            uses,
            discount,
            vbucks,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save coupon data");

      router.push("/dashboard/coupons");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Could not save coupon data.",
      });
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate((prev) => combineDateAndTime(selectedDate, time));
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    setDate((prev) => combineDateAndTime(prev, newTime));
  };

  const combineDateAndTime = (date, time) => {
    if (!date) return null;
    const [hours, minutes] = time.split(":").map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);
    return combinedDate;
  };

  const breadcrumbItems = [
    { title: "Coupons", link: "/dashboard/coupons" },
    {
      title: params.id ? "Edit" : "Create",
      link: params.id
        ? `/dashboard/coupons/edit/${params.id}`
        : "/dashboard/coupons/new",
    },
  ];

  return (
    <main className="flex-1 pt-16">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`${
              params.id ? "Edit Coupon" : "Create new Coupon"
            }`}</h2>
            <p className="text-sm text-muted-foreground">
              {`${
                params.id
                  ? "Edit your coupons now."
                  : "Create your coupons now."
              }`}
            </p>
          </div>
        </div>
        <Separator />
        {params.id && paramsLoading ? (
          <Spin className="w-10 h-10" />
        ) : (
          <ScrollArea className="w-full">
            <form onSubmit={handleSubmitForm}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full gap-4">
                <div>
                  <Label className="text-md">Code</Label>
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label className="text-md">Discount</Label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Discount"
                    className="mt-2"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label className="text-md">Max uses</Label>
                  <Input
                    type="number"
                    value={uses}
                    onChange={(e) => setUses(e.target.value)}
                    placeholder="Max uses"
                    className="mt-2"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label className="text-md">Expires</Label>
                  <div className="flex items-center mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="relative ml-2">
                      <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="time"
                        id="time"
                        className="bg-gray-50 border leading-none text-gray-400 text-sm rounded-lg bg-transparent block w-full p-2.5"
                        value={time}
                        onChange={handleTimeChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-2" type="submit">
                {`${params.id ? "Save" : "Create"}`}
              </Button>
            </form>
          </ScrollArea>
        )}
      </div>
    </main>
  );
};

export default NewCategoryPage;
