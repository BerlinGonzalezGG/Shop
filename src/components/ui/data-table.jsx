"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { AlertModal } from "./alert-modal";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { saveAs } from "file-saver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash,
  FileDown,
} from "lucide-react";

export function DataTable({
  columns,
  data,
  searchKey,
  action,
  type,
  pageSizeOptions = [10, 20, 30, 50, 100],
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSizeOptions[0],
  });
  //const [searchKey, setsearchKey] = useState();

  if (data.length > 100) {
    pageSizeOptions.push(data.length);
  }

  const pageData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return data.slice(start, end);
  }, [data, pagination.pageIndex, pagination.pageSize]);

  const table = useReactTable({
    data: pageData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      columnFilters,
    },
  });

  const handlePageSizeChange = (value) => {
    const newSize = Number(value);
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      pageIndex: 0,
    }));
  };

  const [loading, setloading] = useState(false);
  const [open, setopen] = useState(false);
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedData = selectedRows.map((row) => row.original);

  const onConfirm = async () => {
    setloading(true);
    const res = await fetch(`/api/${type}/many`, {
      body: JSON.stringify(selectedData.map((item) => item._id)),
      method: "DELETE",
    });
    const response = await res.json();
    if (response) {
      setopen(false);
      setloading(false);
      await action();
      table.toggleAllPageRowsSelected(false);
    } else {
      setloading(false);
      toast({
        title: "Error",
        description: `Failed to delete ${type}.`,
        status: "error",
      });
    }
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(selectedData, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "data.csv");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          placeholder={
            searchKey === "_id" ? "Search Id.." : `Search ${searchKey}...`
          }
          value={table.getColumn(searchKey)?.getFilterValue() ?? ""}
          onChange={(event) => {
            table.getColumn(searchKey)?.setFilterValue(event.target.value);
          }}
          className="w-full md:max-w-sm"
        />
        {/*<Select onValueChange={(e) => setsearchKey(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search key" />
          </SelectTrigger>
          <SelectContent>
            {searchKeys.map((search, index) => (
              <SelectItem key={index} value={search.value}>
                {search.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>*/}
        {/* 
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter emails..."
              value={table.getColumn("paymentStatus")?.getFilterValue() || ""}
              onChange={(event) =>
                table
                  .getColumn("paymentStatus")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          */}

        {selectedData.length > 0 && (
          <>
            <AlertModal
              isOpen={open}
              onClose={() => setopen(false)}
              onConfirm={onConfirm}
              loading={loading}
            />
            <Button
              title="Delete"
              variant="outline"
              size="icon"
              onClick={() => setopen(true)}
            >
              <Trash width={20} height={20} className="text-gray-300" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Export"
              onClick={downloadJSON}
            >
              <FileDown width={20} height={20} className="text-gray-300" />
            </Button>
          </>
        )}
      </div>
      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <div
                        title={
                          data[cell.id.split("_")[0]][cell.id.split("_")[1]]
                        }
                        className={`truncate max-w-md ${
                          ["paymentMethod", "paymentStatus", "status"].includes(
                            cell.id.split("_")[1]
                          )
                            ? "capitalize"
                            : ""
                        }`}
                      >
                        {(() => {
                          const columnKey = cell.column.id;
                          const rowData = row.original; // Get row data from row.original

                          switch (columnKey) {
                            case "amount":
                              return `$${
                                rowData.discount?.value
                                  ? rowData.items
                                      .reduce(
                                        (total, item) =>
                                          total +
                                          item.price *
                                            item.quantity *
                                            (1 - rowData.discount.value / 100) *
                                            rowData.currency.price,
                                        0
                                      )
                                      .toFixed(2)
                                  : rowData.items
                                      .reduce(
                                        (total, item) =>
                                          total +
                                          item.price *
                                            item.quantity *
                                            rowData.currency.price,
                                        0
                                      )
                                      .toFixed(2)
                              } ${rowData.currency.label}`;
                            case "_id":
                              return rowData._id.slice(-5).toUpperCase();
                            case "paymentMethod":
                              return rowData.payment.method;
                            case "paymentStatus":
                              if (rowData.payment.status === true) {
                                return "Success";
                              } else {
                                return "Pending";
                              }
                            case "price":
                              return `$${rowData[columnKey]}`;
                            case "discount":
                              return `%${rowData[columnKey]}`;
                            case "timestamp":
                            case "lastUpdate":
                            case "expires":
                              const dateKey =
                                columnKey === "createdAt"
                                  ? "timestamp"
                                  : columnKey;
                              return new Date(
                                rowData[dateKey]
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: false,
                              });
                            case "friends":
                              return rowData.friends.length;
                            case "email":
                              if (rowData.shipping) {
                                return rowData.shipping.email;
                              } else {
                                return rowData.email;
                              }

                            case "status":
                              if (rowData.price) {
                                return rowData.status ? "Active" : "Inactive";
                              } else {
                                return rowData.status === true
                                  ? "Success"
                                  : "Pending";
                              }
                            case "gifts":
                              return `${rowData[columnKey]}/5`;
                            default:
                              return flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              );
                          }
                        })()}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Rows per page
              </p>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
