"use client";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Spin from "@/components/spin";
import { getCsrfToken } from "next-auth/react";

const NewUserPage = ({ params }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [paramsLoading, setParamsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getData = async () => {
    try {
      const res = await fetch(`/api/users/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch data.");
      const response = await res.json();
      if (!response) return;
      setEmail(response.email);
      setRole(response.role || "");
      setName(response.name || "");
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
    if (!email.trim()) {
      return toast({
        title: "Error",
        description: "Email cannot be empty",
      });
    }
    try {
      const res = await fetch(
        params.id ? `/api/users/${params.id}` : "/api/users",
        {
          method: params.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await getCsrfToken(),
          },
          body: JSON.stringify({
            email,
            name,
            role,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to save user.");
      router.push("/dashboard/users");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const breadcrumbItems = [
    { title: "Users", link: "/dashboard/users" },
    {
      title: params.id ? "Edit" : "Create",
      link: params.id
        ? `/dashboard/users/edit/${params.id}`
        : "/dashboard/users/new",
    },
  ];

  return (
    <main className="flex-1 pt-16">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`${
              params.id ? "Edit User" : "Create new User"
            }`}</h2>
            <p className="text-sm text-muted-foreground">
              {`${
                params.id ? "Edit your users now." : "Create your users now."
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4">
                <div>
                  <Label className="text-md">Email</Label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="mt-2 "
                  />
                </div>
                <div>
                  <Label className="text-md">Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="mt-2 "
                  />
                </div>
                <div>
                  <Label className="text-md">Role</Label>
                  <div className="mt-2">
                    <Select value={role} onValueChange={(e) => setRole(e)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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

export default NewUserPage;
