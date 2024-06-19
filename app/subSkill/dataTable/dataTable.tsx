"use client";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteSubSkill } from "../action";
// import { deleteSubSkill } from "../action";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  parentSkills: any[];
}

export function SubSkillsDataTable<TData, TValue>({
  columns,
  data,
  parentSkills,
}: DataTableProps<TData, TValue>) {
  const [key, setKey] = useState(0);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [loadings, setLoadings] = useState(false);
  const router = useRouter();
  const [parentId, setParentId] = useState("");
  const [name, setName] = useState("");

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(data.length / pageSize),
  });

  const handleFilterChange = (event: { target: { value: any } }) => {
    setLoadings(true);
    setName(event.target.value);
    setCurrentPage(1);
    if (event.target.value === "") {
      router.push(`/subSkill?&parentId=${parentId}&page=1&limit=10`);
      setLoadings(false);
      return;
    }
    router.push(
      `/subSkill?name=${event.target.value}&parentId=${parentId}&page=1&limit=10`
    );
    setLoadings(false);
  };

  const handleSelectChange = (value: any) => {
    setLoadings(true);
    setParentId(value);
    setCurrentPage(1);
    if (value !== "all") {
      if (name === "") {
        router.push(`/subSkill?parentId=${value}&page=1&limit=10`);
        setLoadings(false);
        return;
      } else {
        router.push(`/subSkill?name=${name}&parentId=${value}&page=1&limit=10`);
        setLoadings(false);
        return;
      }
    } else {
      if (name === "") {
        router.push(`/subSkill?page=1&limit=10`);
        setLoadings(false);
        return;
      } else {
        router.push(`/subSkill?name=${name}&page=1&limit=10`);
        setLoadings(false);
        return;
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    // Update the current page
    setCurrentPage(newPage);
    if (name === "") {
      router.push(`/subSkill?parentId=${parentId}&page=${newPage}&limit=10`);
    } else if (name === "" && parentId === "") {
      router.push(`/subSkill?page=${newPage}&limit=10`);
    } else {
      router.push(
        `/subSkill?name=${name}&parentId=${parentId}&page=${newPage}&limit=10`
      );
    }
    // router.push(
    //   `/subSkill?name=${name}&parentId=${parentId}&page=${newPage}&limit=10`
    // );
  };

  const onDeleteSubSkill = async (id: string) => {
    try {
      const response = await deleteSubSkill(id);
      if (response.message === "Skill deleted successfully") {
        Swal.fire("Skill deleted successfully", "", "success");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      Swal.fire("Error deleting skill", "", "error");
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
        <TableBody className="min-h-[300px]">
          {loadings ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <Spinner />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
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
                          href={`/subSkill/${
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
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={data.length < pageSize}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
