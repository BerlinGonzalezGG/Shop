"use client";
import { useState, useEffect, useCallback } from "react";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Handshake, ArrowLeftRight } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  MoreHorizontal,
  Trash,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserX,
} from "lucide-react";
import { getCsrfToken } from "next-auth/react";
import Spin from "@/components/spin";

export const CellAction = ({ data, getAccounts }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounts/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({
          accountId: data.botId,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove account");

      setOpen(false);
      toast({
        title: `Success`,
        description: `Account removed`,
      });
      getAccounts();
    } catch (error) {
      console.error("Error removing account:", error);
      toast({
        title: "Error",
        description: error.message,
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
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns = (getAccounts) => [
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
    accessorKey: "bucks",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-0 hover:bg-transparent hover:underline underline-offset-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        VBucks
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </Button>
    ),
    sortingFn: (rowA, rowB) => rowA.original.bucks - rowB.original.bucks,
    cell: ({ row }) => `${row.original.bucks}`,
  },
  {
    accessorKey: "bot",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-0 hover:bg-transparent hover:underline underline-offset-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Bot
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </Button>
    ),
    sortingFn: (rowA, rowB) =>
      rowA.original.bot.localeCompare(rowB.original.bot),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-0 hover:bg-transparent hover:underline underline-offset-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </Button>
    ),
    sortingFn: (rowA, rowB) =>
      rowA.original.email.localeCompare(rowB.original.email),
  },
  {
    accessorKey: "botId",
    header: "Id",
  },
  {
    accessorKey: "friends",
    header: "Friends",
  },
  {
    accessorKey: "gifts",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-0 hover:bg-transparent hover:underline underline-offset-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Gifts
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </Button>
    ),
    sortingFn: (rowA, rowB) => rowA.original.gifts - rowB.original.gifts,
    cell: ({ row }) => `${row.original.gifts}/5`,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction data={row.original} getAccounts={getAccounts} />
    ),
  },
];

const breadcrumbItems = [{ title: "Accounts", link: "/dashboard/accounts" }];

const DashboardAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [errorAccounts, seterrorAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [creatorLoading, setCreatorLoading] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [creatorCode, setCreatorCode] = useState("");

  const [deleteLoading, setdeleteLoading] = useState(false);
  const [deleteOpen, setdeleteOpen] = useState(false);
  const [deleteUser, setdeleteUser] = useState("");

  const { toast } = useToast();

  const handleRemoveAccount = async (data) => {
    try {
      const res = await fetch(`/api/accounts/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({
          accountId: data.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove account");

      toast({
        title: `Success`,
        description: `Account removed`,
      });
      getAccounts();
    } catch (error) {
      console.error("Error removing account:", error);
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (token.trim() === "") {
      return;
    }
    try {
      setTokenLoading(true);
      const res = await fetch("/api/accounts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({
          authorizationCode: JSON.parse(token).authorizationCode,
        }),
      });
      const resJson = await res.json();
      if (resJson.message === "Account saved successfully") {
        setToken("");
        setOpen(false);
        toast({
          title: `Success`,
          description: `Account saved`,
        });
        getAccounts();
      } else if (resJson === "account-already-registered") {
        toast({
          title: `Error`,
          description: `Account already registered`,
        });
      }
    } catch (error) {
      console.error("Error adding account:", error);
      toast({
        title: "Error",
        description: "Error adding account.",
      });
    } finally {
      setTokenLoading(false);
    }
  };

  const getAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts", { method: "GET" });
      const response = await res.json();
      setAccounts(response.successAccounts);
      seterrorAccounts(response.errorAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Error fetching accounts.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSubmitCreatorCode = async (e) => {
    e.preventDefault();
    try {
      setCreatorLoading(true);
      const res = await fetch("/api/creatorcode/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({
          username: creatorCode,
        }),
      });
      const resJson = await res.json();
      if (resJson) {
        toast({
          title: `Success`,
          description: "Creator code set successfully",
        });
      }
    } catch (error) {
      console.error("Error setting creator code:", error);
      toast({
        title: "Error",
        description: "Error setting creator code.",
      });
    } finally {
      setCreatorLoading(false);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      setdeleteLoading(true);
      const res = await fetch("/api/accounts/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({
          username: deleteUser,
        }),
      });
      const resJson = await res.json();
      if (resJson) {
        toast({
          title: `Success`,
          description: "User deleted",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Error deleting user.",
      });
    } finally {
      setdeleteLoading(false);
    }
  };

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  return (
    <main className="flex-1 pt-16">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`Accounts (${accounts.length})`}</h2>
            <p className="text-sm text-muted-foreground">
              Manage accounts (Client side table functionalities.)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={deleteOpen} onOpenChange={setdeleteOpen}>
              <DialogTrigger asChild className="lg:w-auto w-full">
                <Button
                  variant="outline"
                  disabled={deleteLoading}
                  className="text-xs md:text-sm"
                >
                  <UserX className="mr-2 h-4 w-4" /> Delete User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleDeleteUser}>
                  <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                      Delete user from friends of all bot accounts!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col mt-4">
                    <Label htmlFor="creatorcode">Username</Label>
                    <Input
                      value={deleteUser}
                      onChange={(e) => setdeleteUser(e.target.value)}
                      id="deleteuser"
                      className="mt-2"
                      disabled={deleteLoading}
                      required
                      placeholder="berlingonzalez"
                    />
                  </div>
                  <DialogFooter asChild>
                    <Button
                      disabled={deleteLoading}
                      type="submit"
                      className="w-full mt-2 flex justify-center items-center"
                      variant="secondary"
                    >
                      {deleteLoading ? (
                        <Spin className="w-5 h-5 mx-auto" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={creatorOpen} onOpenChange={setCreatorOpen}>
              <DialogTrigger asChild className="lg:w-auto w-full">
                <Button
                  variant="secondary"
                  disabled={creatorLoading}
                  className="text-xs md:text-sm"
                >
                  <Handshake className="mr-2 h-4 w-4" /> Set Creator code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitCreatorCode}>
                  <DialogHeader>
                    <DialogTitle>Set creator code</DialogTitle>
                    <DialogDescription>
                      Set creator code to all your bot accounts!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col mt-4">
                    <Label htmlFor="creatorcode">Creator code</Label>
                    <Input
                      value={creatorCode}
                      onChange={(e) => setCreatorCode(e.target.value)}
                      id="creatorcode"
                      className="mt-2"
                      disabled={creatorLoading}
                      required
                      placeholder="berlingonzalez"
                    />
                  </div>
                  <DialogFooter asChild>
                    <Button
                      disabled={creatorLoading}
                      type="submit"
                      className="w-full mt-2 flex justify-center items-center"
                      variant="secondary"
                    >
                      {creatorLoading ? (
                        <Spin className="w-5 h-5 mx-auto" />
                      ) : (
                        "Set"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild className="lg:w-auto w-full">
                <Button className="text-xs md:text-sm">
                  <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddAccount}>
                  <DialogHeader>
                    <DialogTitle>Add account</DialogTitle>
                    <DialogDescription>
                      Add account for autosend gifts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <p className="text-xs text-gray-400 mt-2">
                      Please copy the all the text and paste into the input
                      below.
                    </p>
                    <div className="flex flex-col">
                      <Label htmlFor="token">Token</Label>
                      <Input
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        id="token"
                        className="mt-2"
                        disabled={tokenLoading}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <Link
                      target="_blank"
                      className="w-full h-10 mb-2 rounded-lg flex items-center justify-center text-sm hover:bg-[#1A1A1A] transition-all bg-[#2A2A2A]"
                      href="https://www.epicgames.com/id/api/redirect?clientId=3f69e56c7649492c8cc29f1af08a8a12&responseType=code"
                    >
                      View code
                    </Link>
                  </div>
                  <DialogFooter>
                    <Button
                      disabled={tokenLoading}
                      type="submit"
                      className="w-full"
                      variant="outline"
                    >
                      {tokenLoading ? (
                        <svg
                          className={`animate-spin mr-1 h-5 w-5 text-white`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {errorAccounts.length > 0 && (
          <div>
            <div className="bg-red-400 font-semibold border-2 border-red-500 text-red-900 py-2 px-3 text-sm rounded-lg">
              You have made a security change to one of your accounts, please
              remove it and reinsert it so it can continue working.
            </div>
            <h2 className="text-lg text-gray-400 font-semibold mt-1 tracking-tight">
              Accounts with error
            </h2>
            <div className="flex flex-col gap-2">
              {errorAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="border-2 flex items-center rounded-lg justify-between border-red-500 py-2 px-3"
                >
                  <p className="text-sm">
                    {acc.bot} - {acc.id}
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveAccount(acc)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Separator />
        {loading ? (
          <Spin className="h-10 w-10" />
        ) : (
          <DataTable
            searchKey="bot"
            columns={columns(getAccounts)}
            action={getAccounts}
            data={accounts}
            type={"accounts"}
          />
        )}
      </div>
    </main>
  );
};

export default DashboardAccountsPage;
