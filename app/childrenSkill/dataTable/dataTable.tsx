import { getSkillParents } from "@/app/subSkill/action";
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
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getChildrenSkills, getSubSkillByParent } from "../action";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSubSkill: (id: string) => void;
}

export function SubSkillsDataTable<TData, TValue>({
  columns,
  data,
  onDeleteSubSkill,
}: DataTableProps<TData, TValue>) {
  const [key, setKey] = useState(0); // State to force re-render
  const pageSize = 10; // Number of rows per page
  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [parentSkills, setParentSkills] = useState<any[]>([]);
  const [parentSkillSelected, setparentSkillSelected] = useState<any>();
  const [subSkills, setSubSkills] = useState<any[]>([]);

  // Calculate the range of data to display for the current page
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentPageData = data.slice(startIndex, endIndex);

  useEffect(() => {
    getSkillParents().then((data) => {
      setParentSkills(data);
    });
  }, []);

  useEffect(() => {
    const subskills = async () => {
      const subSkill = await getSubSkillByParent(parentSkillSelected);

      // get sub skills id
      const subSkillsId = subSkill.map((skill: any) => skill.id);

      // filter children skills by sub skills id
      const childrenSkills = await getChildrenSkills();

      const filteredChildrenSkills = childrenSkills.filter((skill: any) =>
        subSkillsId.includes(skill.subSkillId)
      );

      // merge sub skills with children skills
      const subSkillsWithChildren = subSkill.map((skill: any) => {
        const children = filteredChildrenSkills.filter(
          (child: any) => child.subSkillId === skill.id
        );
        return { ...skill, children: children.length };
      });

      setSubSkills(subSkillsWithChildren);
    };

    subskills();
  }, [parentSkillSelected]);

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
      <div className="flex p-4">
        <Input
          placeholder="Filter skill..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-4"
        />
        <div className="mr-4">
          <Select
            onValueChange={(value) => {
              setparentSkillSelected(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by parent skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {parentSkills.map((parentSkill) => (
                  <SelectItem key={parentSkill.id} value={parentSkill.parentId}>
                    {parentSkill.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {
          // If there is a selected parent skill, display the sub skills
          parentSkillSelected && (
            <Select
              onValueChange={(value) => {
                table.getColumn("subSkillId")?.setFilterValue(value as string);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by parent skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {subSkills.map((subSkill) => (
                    <SelectItem key={subSkill.id} value={subSkill.id}>
                      <div>
                        {subSkill.name}
                        {subSkill.children != "0" ? (
                          <span className="text-sm text-gray-500">
                            {" "}
                            ({subSkill.children})
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )
        }
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
