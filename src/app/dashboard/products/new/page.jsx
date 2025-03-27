"use client";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Spin from "@/components/spin";
import { getCsrfToken } from "next-auth/react";

const NewProductPage = ({ params }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [order, setorder] = useState(0);
  const [paramsLoading, setParamsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [download, setdownload] = useState("");
  const { toast } = useToast();

  const handleRemoveImage = () => {
    setImages([]);
  };

  const getData = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch product data");
      const response = await res.json();
      setName(response.name);
      setPrice(response.price);
      setCategory(response.category);
      if (response.status) setStatus(response.status);
      if (response.image) setImages([response.image]);
      if (response.download) setdownload(response.download);
      if (response.order) setorder(response.order);
      setParamsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (params.id) {
      setParamsLoading(true);
      getData();
    }
  }, [params.id]);

  const handleSubmitForm = async () => {
    if (!name.trim()) {
      return toast({
        title: "Error",
        description: "Name cannot be empty",
      });
    }
    if (price <= 0) {
      return toast({
        title: "Error",
        description: "Price must be greater than 0",
      });
    }
    if (!category.trim()) {
      return toast({
        title: "Error",
        description: "Category cannot be empty",
      });
    }
    try {
      const body = {
        name,
        price,
        image:
          images.length > 0
            ? images[0]
            : {
                url: "https://utfs.io/f/297986e0-bab2-44c4-ac06-76091197b987-frqhhy.jpg",
              },
        quantity: 1,
        category,
        order,
        status,
        ...(category == "download" ? { download } : {}),
      };
      const res = await fetch(
        params.id ? `/api/products/${params.id}` : "/api/products",
        {
          method: params.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await getCsrfToken(),
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Failed to save product");

      router.push("/dashboard/products");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const breadcrumbItems = [
    { title: "Products", link: "/dashboard/products" },
    { title: params.id ? "Edit" : "Create", link: "/dashboard/products/new" },
  ];

  return (
    <main className="flex-1 pt-16">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`${
              params.id ? "Edit product" : "Create new Product"
            }`}</h2>
            <p className="text-sm text-muted-foreground">
              {`${
                params.id
                  ? "Edit your products now."
                  : "Create your products now."
              }`}
            </p>
          </div>
        </div>
        <Separator />
        {params.id && paramsLoading ? (
          <Spin className="w-10 h-10" />
        ) : (
          <ScrollArea className="w-full">
            <div className="flex items-center flex-col justify-between gap-4 w-full">
              <div className="w-full">
                <Label className="text-md">Image</Label>
                <div className="flex items-start w-full">
                  <FileUpload
                    images={images}
                    setImages={setImages}
                    handleRemoveImage={handleRemoveImage}
                  />
                  <div className="flex-1 ml-10">
                    <div>
                      <Label className="text-md">Name</Label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of your product"
                        className="mt-2 "
                      />
                    </div>

                    <div className="mt-4">
                      <Label className="text-md">Price</Label>
                      <div className="flex items-center mt-2 relative">
                        <p className="text-gray-400 mt-[1px] text-sm mr-2 absolute left-3">
                          $
                        </p>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(parseFloat(e.target.value))}
                          placeholder="10.00"
                          className="pl-[21px] text-sm flex items-center"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="text-md">Category</Label>
                      <Select
                        value={category}
                        onValueChange={(e) => setCategory(e)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="vbucks">V-Bucks</SelectItem>
                            <SelectItem value="pack">Packs</SelectItem>
                            <SelectItem value="skin">Skin</SelectItem>
                            <SelectItem value="battlepass">
                              Battle Pass
                            </SelectItem>
                            <SelectItem value="club">Fortnite Club</SelectItem>
                            <SelectItem value="vbuckspremade">
                              V-Bucks Premade account
                            </SelectItem>
                            <SelectItem value="download">
                              Download File
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mt-4">
                      <Label className="text-md">Order</Label>
                      <div className="flex items-center mt-2 relative">
                        <p className="text-gray-400 mt-[1px] text-sm mr-2 absolute left-3">
                          #
                        </p>
                        <Input
                          type="number"
                          value={order}
                          onChange={(e) => setorder(Number(e.target.value))}
                          placeholder="10.00"
                          className="pl-[21px] text-sm flex items-center"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="text-md">Status</Label>
                      <Select
                        value={status.toString()} // Convert boolean to string
                        onValueChange={(e) => setStatus(e === "true")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select the status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mt-4">
                      <Label className="text-md">File Name</Label>
                      <Input
                        type="text"
                        value={download}
                        onChange={(e) => setdownload(e.target.value)}
                        placeholder="Name of the file with extension"
                        className="mt-2 "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <Button className="mt-2" onClick={handleSubmitForm}>
              {params.id ? "Save" : "Create"}
            </Button>
          </ScrollArea>
        )}
      </div>
    </main>
  );
};

export default NewProductPage;
