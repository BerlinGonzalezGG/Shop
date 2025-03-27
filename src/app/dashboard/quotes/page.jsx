"use client";
import { useState, useEffect } from "react";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, MoreHorizontal, Trash, SquarePercent } from "lucide-react";
import Spin from "@/components/spin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getCsrfToken } from "next-auth/react";

export const CellAction = ({ data, getQuotes }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/currency/${data._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      if (res.ok) {
        setOpen(false);
        getQuotes();
      } else {
        throw new Error("Failed to delete product.");
      }
    } catch (error) {
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
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/quotes/edit/${data._id}`)}
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

export const columns = (getQuotes) => [
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
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "lastUpdate",
    header: "Last update",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} getQuotes={getQuotes} />,
  },
];

const breadcrumbItems = [{ title: "Quotes", link: "/dashboard/quotes" }];

const DashboardQuotesPage = () => {
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [multiplierLoading, setMultiplierLoading] = useState(false);
  const [skinMultiplier, setSkinMultiplier] = useState({ price: "" });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const getQuotes = async () => {
    try {
      const res = await fetch("/api/currency", { method: "GET" });
      const response = await res.json();
      setQuotes(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch quotes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMultiplier = async () => {
    try {
      const res = await fetch("/api/multiplier", { method: "GET" });
      const response = await res.json();
      setSkinMultiplier(response[0]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch multiplier.",
      });
    }
  };

  const handleSubmitSkinMultiplier = async (e) => {
    e.preventDefault();
    setMultiplierLoading(true);
    try {
      const res = await fetch(`/api/multiplier/${skinMultiplier._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({
          price: skinMultiplier.price,
        }),
      });

      if (!res.ok) throw new Error("Failed to update multiplier.");
      getMultiplier();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    } finally {
      setMultiplierLoading(false);
    }
  };

  useEffect(() => {
    getQuotes();
    getMultiplier();
  }, []);

  return (
    <main className="flex-1 pt-16 overflow-hidden">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`Quotes (${quotes.length})`}</h2>
            <p className="text-sm text-muted-foreground">
              Manage quotes (Client side table functionalities.)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild className="lg:w-auto w-full">
                <Button variant="secondary" className="text-xs md:text-sm">
                  <SquarePercent className="mr-2 h-4 w-4" /> Skin multiplier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitSkinMultiplier}>
                  <DialogHeader>
                    <DialogTitle>Set Skin Multiplier</DialogTitle>
                    <DialogDescription>
                      Set Skin Multiplier now
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col mt-4">
                    <Label htmlFor="skinMultiplier">Multiplier</Label>
                    <Input
                      value={skinMultiplier.price || ""}
                      onChange={(e) =>
                        setSkinMultiplier((prevState) => ({
                          ...prevState,
                          price: e.target.value,
                        }))
                      }
                      id="skinMultiplier"
                      className="mt-2"
                      disabled={multiplierLoading}
                      required
                      placeholder="0.0042"
                    />
                  </div>
                  <DialogFooter asChild>
                    <Button
                      disabled={multiplierLoading}
                      type="submit"
                      className="w-full mt-2 flex justify-center items-center"
                      variant="secondary"
                    >
                      {multiplierLoading ? (
                        <Spin className="w-5 h-5 mx-auto" />
                      ) : (
                        "Set"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              className="text-xs md:text-sm"
              onClick={() => router.push(`/dashboard/quotes/new`)}
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
            searchKey="label"
            columns={columns(getQuotes)}
            action={getQuotes}
            data={quotes}
            type={"quotes"}
          />
        )}
      </div>
    </main>
  );
};

export default DashboardQuotesPage;
