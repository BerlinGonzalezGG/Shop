"use client";
import { useState, useEffect } from "react";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Ban, OctagonX, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/ui/alert-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Spin from "@/components/spin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CellAction = ({ data, getUsers }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${data._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user.");
      if (res.ok) {
        setOpen(false);
        getUsers();
      } else {
        throw new Error("User not deleted.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/users/edit/${data._id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns = (getUsers) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} getUsers={getUsers} />,
  },
];

const breadcrumbItems = [{ title: "Users", link: "/dashboard/users" }];

const DashboardUsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [banEmail, setbanEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalLoading, setmodalLoading] = useState(false);
  const [banned, setbanned] = useState([]);
  const [open, setopen] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch users.");
      const response = await res.json();
      setUsers(response);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBannedUsers = async () => {
    const res = await fetch("/api/users/ban", { method: "GET" });
    const response = await res.json();
    setbanned(response);
  };

  const handleBanUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/ban", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: banEmail,
        }),
      });
      if (!res.ok) throw new Error("Failed to save ban.");
      await getBannedUsers();
      setbanEmail("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnbanUser = async (user) => {
    try {
      const res = await fetch(`/api/users/ban/${user._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove ban.");
      const response = await res.json();
      if (response) {
        setopen(false);
        getBannedUsers();
      } else {
        throw new Error("User not deleted.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    getBannedUsers();
  }, []);

  return (
    <main className="flex-1 pt-16 overflow-hidden">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`Users (${users.length})`}</h2>
            <p className="text-sm text-muted-foreground">
              Manage users (Client side table functionalities.)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="text-xs md:text-sm" variant="outline">
                  <Ban className="mr-2 h-4 w-4" /> Ban user
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>User Ban</SheetTitle>
                  <SheetDescription>Ban users</SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <form
                    onSubmit={handleBanUser}
                    className="flex flex-col gap-2"
                  >
                    <Label>Email</Label>
                    <Input
                      value={banEmail}
                      onChange={(e) => setbanEmail(e.target.value)}
                      placeholder="User email"
                    />
                    <Button type="submit">Ban</Button>
                  </form>
                  {banned.length > 0 && (
                    <div className="mt-2 rounded-sm border p-2">
                      <p className="text-sm">Banned users</p>
                      <div className="mt-2 flex flex-col gap-2">
                        {banned.map((banned, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <p className="text-xs text-gray-300">
                              {banned.email}
                            </p>
                            <OctagonX
                              onClick={() => handleUnbanUser(banned)}
                              className="w-5 h-5 text-gray-400 hover:cursor-pointer hover:text-white transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Button
              className="text-xs md:text-sm"
              onClick={() => router.push(`/dashboard/users/new`)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
        </div>
        <Separator />
        {loading ? (
          <Spin className="w-10 h-10" />
        ) : (
          <DataTable
            searchKey="email"
            columns={columns(getUsers)}
            action={getUsers}
            data={users}
            type={"users"}
          />
        )}
      </div>
    </main>
  );
};

export default DashboardUsersPage;
