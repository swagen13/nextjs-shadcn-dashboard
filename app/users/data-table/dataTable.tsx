"use client";
import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { deleteUser } from "../action";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: // onDeleteUser,
DataTableProps<TData, TValue>) {
  const [key, setKey] = useState(0); // State to force re-render

  useEffect(() => {
    // Update key to force re-render when data changes
    setKey((prevKey) => prevKey + 1);
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  async function deleteUserSubmit(id: string) {
    try {
      const response = await deleteUser(id);
      if (response.message === "User deleted successfully") {
        Swal.fire({
          title: response.message,
          icon: "success",
        });
        // reload table
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Trigger error alert
      alert("Error deleting user");
    }
  }

  return (
    <div className="rounded-md border">
      <Table key={key}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell key={cell.id}>
                    {index === columns.length - 1 ? (
                      <>
                        <Link
                          rel="preload"
                          href={`/users/${row.getValue("id")}`}
                        >
                          <Button
                            size="sm"
                            className="mr-4 text-yellow-500"
                            variant={"outline"}
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="mr-4 text-red-500"
                          variant={"outline"}
                          onClick={() => {
                            deleteUserSubmit(row.getValue("id"));
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
