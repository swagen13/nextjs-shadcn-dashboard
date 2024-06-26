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
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { deleteChildSkill } from "../action";
import SkillFilter from "./skillFilter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  parentSkills: any[];
  subSkill?: any[];
}

export function ChildrenSkillsDataTable<TData, TValue>({
  columns,
  data,
  parentSkills,
  subSkill,
}: DataTableProps<TData, TValue>) {
  const [key, setKey] = useState(0); // State to force re-render
  const pageSize = 10; // Number of rows per page
  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const [name, setName] = useState("");
  const router = useRouter();

  // Calculate the range of data to display for the current page
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentPageData = data.slice(startIndex, endIndex);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleSelectChange = (value: any) => {
    router.push(`/childrenSkill?&parentId=${value}&page=1&limit=10`);
  };

  const handleFilterChange = (event: { target: { value: any } }) => {};

  const onDeleteSubSkill = async (id: string) => {
    try {
      const response = await deleteChildSkill(id);
      if (response.message === "Skill deleted successfully") {
        console.log("Skill deleted successfully");

        // Trigger success alert
        Swal.fire("Skill deleted successfully", "", "success");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      // Trigger error alert
      Swal.fire("Error deleting skill", "", "error");
    }
  };

  return (
    <div className="rounded-md border">
      <div className="flex p-4">
        <Input
          placeholder="Filter skill..."
          value={name}
          onChange={(event) => handleFilterChange}
          className="max-w-sm mr-4"
        />
        <SkillFilter
          parentSkills={parentSkills}
          subSkill={subSkill && subSkill.length > 0 ? subSkill : undefined}
          onSelectChange={handleSelectChange}
        />
        {/* <div className="mr-4">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by parent skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Show All</SelectItem>
                {parentSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.parentid}>
                    {skill.name} ({skill.children_count})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {subSkill ? (
          <Select onValueChange={(value) => {}}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by parent skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {subSkill.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name} ({skill.children_count})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : null} */}
      </div>

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
                          href={`/childrenSkill/${
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
                          className="text-red-500"
                          variant={"outline"}
                          onClick={() => {
                            onDeleteSubSkill(
                              (row.original as { id: string }).id
                            );
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
      <div className="flex justify-between p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
