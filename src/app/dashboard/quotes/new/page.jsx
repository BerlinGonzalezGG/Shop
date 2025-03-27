"use client";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Spin from "@/components/spin";
import { getCsrfToken } from "next-auth/react";

const NewCategoryPage = ({ params }) => {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState(0);
  const [flag, setFlag] = useState("");
  const [paramsLoading, setParamsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getData = async () => {
    try {
      const res = await fetch(`/api/currency/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch currency data.");
      const response = await res.json();
      setValue(response.value);
      setLabel(response.label);
      setPrice(response.price);
      setFlag(response.flag);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    } finally {
      setParamsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      setParamsLoading(true);
      getData();
    }
  }, [params.id]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!value.trim()) {
      return toast({
        title: "Error",
        description: "Value cannot be empty",
      });
    }
    if (!label.trim()) {
      return toast({
        title: "Error",
        description: "Label cannot be empty",
      });
    }
    if (!price) {
      return toast({
        title: "Error",
        description: "Price cannot be empty",
      });
    }

    try {
      const res = await fetch(
        params.id ? `/api/currency/${params.id}` : "/api/currency",
        {
          method: params.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await getCsrfToken(),
          },
          body: JSON.stringify({
            value,
            label,
            price,
            flag,
            lastUpdate: new Date(),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save currency data.");
      router.push("/dashboard/quotes");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const breadcrumbItems = [
    { title: "Quotes", link: "/dashboard/quotes" },
    {
      title: params.id ? "Edit" : "Create",
      link: params.id
        ? `/dashboard/quotes/edit/${params.id}`
        : "/dashboard/quotes/new",
    },
  ];

  return (
    <main className="flex-1 pt-16">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`${
              params.id ? "Edit Quote" : "Create new Quote"
            }`}</h2>
            <p className="text-sm text-muted-foreground">
              {`${
                params.id ? "Edit your quotes now." : "Create your quotes now."
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
                  <Label className="text-md">Value</Label>
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Value"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-md">Label</Label>
                  <Input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Label"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-md">Flag</Label>
                  <Input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="Flag"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-md">Price</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Price"
                    className="mt-2"
                  />
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
