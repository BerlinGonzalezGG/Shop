"use client";
import { useState, useEffect } from "react";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/ui/alert-modal";
import { saveAs } from "file-saver";
import {
  Edit,
  FileDown,
  MoreHorizontal,
  Trash,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  EllipsisVertical,
  Check,
  CheckCheck,
  CreditCard,
} from "lucide-react";
import { getCsrfToken } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Spin from "@/components/spin";

// Define CellAction as a separate component for better readability
export const CellAction = ({ data, getOrders }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [openPaid, setOpenPaid] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${data._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOpen(false);
        getOrders();
      } else {
        throw new Error("Failed to delete order");
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

  const onConfirmPaid = async () => {
    setLoading(true);
    try {
      const payment =
        data.payment.method === "transfer"
          ? { method: "transfer", id: data._id, status: true }
          : { status: true };

      const res = await fetch(`/api/orders/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({ payment }),
      });

      if (res.ok) {
        setOpenPaid(false);
        getOrders();
      } else {
        throw new Error("Error updating payment status");
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

  const onConfirmDone = async () => {
    setLoading(true);
    try {
      const payment =
        data.payment.method === "transfer"
          ? { method: "transfer", id: data._id, status: true }
          : undefined;

      const body = { status: true };
      if (payment) {
        body.payment = payment;
      }

      const res = await fetch(`/api/orders/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setOpenDone(false);
        getOrders();
      } else {
        throw new Error("Error updating order status");
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
      <AlertModal
        isOpen={openDone}
        onClose={() => setOpenDone(false)}
        onConfirm={onConfirmDone}
        loading={loading}
      />
      <AlertModal
        isOpen={openPaid}
        onClose={() => setOpenPaid(false)}
        onConfirm={onConfirmPaid}
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
          {data.status === false && (
            <DropdownMenuItem onClick={() => setOpenDone(true)}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark as done
            </DropdownMenuItem>
          )}
          {data.payment.method === "transfer" && !data.payment.status && (
            <DropdownMenuItem onClick={() => setOpenPaid(true)}>
              <CreditCard className="mr-2 h-4 w-4" /> Mark as paid
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/orders/view/${data._id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const getPriorityValue = (rowData) => {
  if (!rowData.status && rowData.payment.status) {
    return 1; // 🔴
  } else if (!rowData.status && rowData.payment.method === "transfer") {
    return 2; // 🔵
  } else if (rowData.status) {
    return 3; // 🟢
  }
  return 4; // ❌
};

export const columns = (getOrders) => [
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
    accessorKey: "priority",
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
          Priority {icon}
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const priorityA = getPriorityValue(rowA.original);
      const priorityB = getPriorityValue(rowB.original);
      return priorityA - priorityB; // Ascending order
    },
    cell: ({ row }) => {
      const priority = getPriorityValue(row.original);
      switch (priority) {
        case 1:
          return `🔴`;
        case 2:
          return `🔵`;
        case 3:
          return `🟢`;
        default:
          return `❌`; // Default case
      }
    },
  },
  {
    accessorKey: "_id",
    header: "Order #",
  },
  {
    accessorKey: "email",
    header: "Customer",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => row.original.payment.method,
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => (row.original.payment.status ? "Paid" : "Unpaid"),
  },
  {
    accessorKey: "timestamp",
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
          Created At {icon}
        </Button>
      );
    },
    cell: ({ row }) =>
      new Date(row.original.timestamp).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-0 hover:bg-transparent hover:underline underline-offset-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
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
      const amountA = rowA.original.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const amountB = rowB.original.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      return amountA - amountB; // Ascending order
    },
    cell: ({ row }) => {
      const amount = row.original.items
        .reduce(
          (total, item) =>
            total + item.price * item.quantity * row.original.currency.price,
          0
        )
        .toFixed(2);

      return `$${amount} ${row.original.currency.label}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (row.original.status ? "Done" : "Pending"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} getOrders={getOrders} />,
  },
];

const breadcrumbItems = [{ title: "Orders", link: "/dashboard/orders" }];

const DashboardOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unpaid, setUnpaid] = useState(false);
  const [orderStatus, setorderStatus] = useState(false);
  const [statusloading, setstatusloading] = useState(true);

  const getOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      const response = await res.json();
      const shownOrders = unpaid
        ? response
        : response.filter(
            (e) => e.payment.status || e.payment.method === "transfer"
          );
      setOrders(shownOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) {
        throw new Error("Failed to fetch settings");
      }
      const response = await res.json();
      setorderStatus(response[0].order);
      setstatusloading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAlternateOrders = async (e) => {
    try {
      const res = await fetch(`/api/settings/6725cf1a4fac20aa985e9fd4`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({ order: e }),
      });

      if (res.ok) {
        getOrderStatus();
      } else {
        throw new Error("Error updating order status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    getOrders();
    getOrderStatus();
  }, [unpaid]);

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(orders, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "orders.json");
  };

  return (
    <main className="flex-1 pt-16 overflow-hidden">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`Orders (${orders.length})`}</h2>
            <p className="text-sm text-muted-foreground">
              Manage orders (Client side table functionalities.)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <EllipsisVertical className="text-gray-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="">Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setUnpaid(!unpaid)}
                  className=" hover:cursor-pointer text-sm px-2"
                >
                  {unpaid && <Check width={15} height={15} className="mr-2" />}{" "}
                  Show unpaid orders
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => {
                handleAlternateOrders(!orderStatus);
              }}
              variant="outline"
              className={`${
                statusloading
                  ? "border-gray-700"
                  : orderStatus
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            >
              {statusloading ? (
                <Spin className="w-4 h-4" />
              ) : orderStatus ? (
                "ON - Orders"
              ) : (
                "OFF - Orders"
              )}
            </Button>
            <Button onClick={downloadJSON} variant="outline">
              <FileDown width={15} height={15} className="text-gray-300 mr-1" />
              Download
            </Button>
          </div>
        </div>
        <Separator />
        {loading ? (
          <Spin className="w-10 h-10" />
        ) : (
          <DataTable
            searchKey="_id"
            columns={columns(getOrders)}
            action={getOrders}
            data={orders}
            type="orders"
          />
        )}
      </div>
    </main>
  );
};

export default DashboardOrdersPage;
