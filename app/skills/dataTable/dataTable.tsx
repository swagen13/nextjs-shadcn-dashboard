"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { deleteSkill } from "../action";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { deleteSkill } from "../action";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  closeNextPage: boolean;
}

function formatSkillName(skill_name: string, level: number): string {
  return "-".repeat(level) + skill_name;
}

export function SkillsDataTable<TData, TValue>({
  columns,
  data,
  closeNextPage,
}: DataTableProps<TData, TValue>) {
  const [key, setKey] = useState(0); // State to force re-render
  const [name, setName] = useState(""); // Filter value
  const [skillLevel, setSkillLevel] = useState(0);
  const [loadings, setLoadings] = useState(false); // Loading state
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    // Update key to force re-render when data changes
    setKey((prevKey) => prevKey + 1);
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleFilterChange = (event: { target: { value: any } }) => {
    setCurrentPage(1);
    setLoadings(true);
    setName(event.target.value);
    if (!event.target.value) {
      router.push(`/skills`);
      setLoadings(false);
      return;
    }
    if (limit) {
      router.push(`/skills?name=${event.target.value}&limit=${limit}&page=1`);
    }
    setLoadings(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (name !== "") {
      router.push(`/skills?name=${name}&limit=${limit}&page=${newPage}`);
    } else {
      router.push(`/skills?limit=${limit}&page=${newPage}`);
    }

    if (limit && name !== "") {
      router.push(`/skills?name=${name}&limit=${limit}&page=${newPage}`);
    } else {
      router.push(`/skills?limit=${limit}&page=${newPage}`);
    }
  };

  const handleLimitChange = (event: { target: { value: any } }) => {
    setCurrentPage(1);
    setLimit(event.target.value);
    if (name !== "") {
      router.push(`/skills?name=${name}&limit=${event.target.value}&page=1`);
    } else {
      router.push(`/skills?limit=${event.target.value}&page=1`);
    }

    if (limit && name !== "") {
      router.push(`/skills?name=${name}&limit=${event.target.value}&page=1`);
    } else {
      router.push(`/skills?limit=${event.target.value}&page=1`);
    }
  };

  // delete skill
  const onDeleteSkill = async (id: string) => {
    const result = await deleteSkill(id);
    if (result.status) {
      Swal.fire({
        title: "Skill deleted successfully",
        icon: "success",
      });
      return false;
    } else {
      Swal.fire({
        title: "Error deleting skill",
        icon: "error",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <div className="flex p-4">
        <Input
          placeholder="Filter skill..."
          onChange={handleFilterChange}
          className="max-w-sm mr-4"
          value={name}
        />
      </div>

      {/* select for limit filter ex. 10 15 20 */}
      <div className="flex justify-end p-4">
        <select
          className="p-2 border rounded-md"
          onChange={(e) => {
            handleLimitChange(e);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
      <div
        className="table-container"
        style={{ height: "500px", overflowY: "auto" }}
      >
        <Table key={key} className="table-fixed w-full">
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
                            href={`/skills/${
                              (row.original as { id: string }).id
                            }`}
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
                              onDeleteSkill(
                                (row.original as { id: string }).id
                              );
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      ) : cell.column.id === "skill_name" ? (
                        formatSkillName(
                          (
                            row.original as {
                              skill_name: string;
                              level: number;
                            }
                          ).skill_name,
                          (row.original as { level: number }).level
                        )
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
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
      </div>
      <div className="flex justify-end p-4">
        <Button
          size="sm"
          className="mr-4"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={closeNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
