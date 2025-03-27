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
  Edit,
  MoreHorizontal,
  Trash,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Spin from "@/components/spin";

export const CellAction = ({ data, getCoupons }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/coupon/${data._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete coupon");
      if (res.ok) {
        setOpen(false);
        getCoupons();
        toast({
          title: "Success",
          description: "Coupon deleted successfully.",
          status: "success",
        });
      } else {
        throw new Error("Failed to delete coupon.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete coupon.",
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
            onClick={() => router.push(`/dashboard/coupons/edit/${data._id}`)}
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

export const columns = (getCoupons) => [
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
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-0 hover:bg-transparent hover:underline underline-offset-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Discount
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </Button>
    ),
    sortingFn: (rowA, rowB) => {
      const discountA = rowA.original.discount ?? 0; // Accede directamente a discount
      const discountB = rowB.original.discount ?? 0; // Accede directamente a discount
      return discountA - discountB;
    },
    cell: ({ row }) => `${row.original.discount ?? 0}%`, // Usa el operador de coalescencia nula
  },
  {
    accessorKey: "uses",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-0 hover:bg-transparent hover:underline underline-offset-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Uses
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </Button>
    ),
    sortingFn: (rowA, rowB) => {
      const usesA = rowA.original.uses ?? 0; // Accede directamente a uses
      const usesB = rowB.original.uses ?? 0; // Accede directamente a uses
      return usesA - usesB;
    },
    cell: ({ row }) => `${row.original.uses ?? 0}`, // Usa el operador de coalescencia nula
  },

  {
    accessorKey: "expires",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const icon =
        isSorted === "asc" ? (
          <ArrowUp className="w-4 h-4" />
        ) : isSorted === "desc" ? (
          <ArrowDown className="w-4 h-4" />
        ) : (
          <ArrowUpDown className="w-4 h-4" />
        );

      return (
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-0 hover:bg-transparent hover:underline underline-offset-2"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Expires At {icon}
        </Button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction data={row.original} getCoupons={getCoupons} />
    ),
  },
];

const breadcrumbItems = [{ title: "Coupons", link: "/dashboard/coupons" }];

const DashboardCouponsPage = () => {
  const router = useRouter();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coupon", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch coupons");

      const response = await res.json();
      setCoupons(response);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch coupons.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  return (
    <main className="flex-1 pt-16 overflow-hidden">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`Coupons (${coupons.length})`}</h2>
            <p className="text-sm text-muted-foreground">
              Manage coupons (Client side table functionalities.)
            </p>
          </div>

          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/dashboard/coupons/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        {loading ? (
          <Spin className="w-10 h-10" />
        ) : (
          <DataTable
            searchKey="code"
            columns={columns(getCoupons)}
            action={getCoupons}
            data={coupons}
            type={"coupons"}
          />
        )}
      </div>
    </main>
  );
};

export default DashboardCouponsPage;
