"use client";
import { useState } from "react";
import Spin from "@/components/spin";
import { useForm } from "react-hook-form";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

const ContactPage = () => {
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    setloading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setloading(false);

    if (!res.ok) {
      throw new Error("Error updating order status");
    }

    const response = await res.json();
    if (response.info) {
      reset();
      toast({
        title: `Success`,
        description: "Email sent",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-gray-50 ">
      <Navbar />
      <main className="flex-1 max-xl:pt-20 xl:flex-row flex-col-reverse min-h-screen w-full  flex items-center justify-center">
        <form
          className="flex flex-col max-md:w-11/12 md:min-w-96"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-5xl font-semibold mb-4">Contact Us</h3>
          <div>
            <Label>
              Name{" "}
              {errors.name && (
                <span className="text-xs text-gray-400">
                  - This field is required
                </span>
              )}
            </Label>
            <Input
              {...register("name", { required: true })}
              className="mt-1"
              disabled={loading}
              placeholder="Name"
            />
          </div>

          <div className="mt-2">
            <Label>
              Email{" "}
              {errors.email && (
                <span className="text-xs text-gray-400">
                  - This field is required and must be a valid email
                </span>
              )}
            </Label>
            <Input
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              placeholder="Email"
              disabled={loading}
              className="mb-2"
            />
          </div>
          <div>
            <Label>
              Message{" "}
              {errors.message && (
                <span className="text-xs text-gray-400">
                  - This field is required
                </span>
              )}
            </Label>
            <Textarea
              {...register("message", { required: true })}
              placeholder="Message"
              disabled={loading}
              className="mb-2 resize-none"
            />
          </div>
          <Button
            disabled={loading}
            className="mt-2"
            variant="outline"
            type="submit"
          >
            {loading ? <Spin className="w-5 h-5 mx-auto" /> : "Send"}
          </Button>
        </form>
        <div className="w-full sm:w-[500px] max-xl:mb-4">
          <Image
            alt="Hero Product"
            className="mx-auto overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            src="/images/contactImage.png"
            width={600}
            height={600}
            loading="eager"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
