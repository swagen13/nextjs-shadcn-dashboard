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
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSkill: (id: string) => void;
}

export function SkillsDataTable<TData, TValue>({
  columns,
  data,
  onDeleteSkill,
}: DataTableProps<TData, TValue>) {
  const [key, setKey] = useState(0); // State to force re-render
  const pageSize = 10; // Number of rows per page
  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Calculate the range of data to display for the current page
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentPageData = data.slice(startIndex, endIndex);

  useEffect(() => {
    // Update key to force re-render when data changes
    setKey((prevKey) => prevKey + 1);
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Input
        placeholder="Filter skill..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
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
                            onDeleteSkill((row.original as { id: string }).id); // Call onDeleteSkill when user is deleted
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
