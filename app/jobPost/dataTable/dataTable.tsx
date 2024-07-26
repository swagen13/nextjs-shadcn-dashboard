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
import { useRouter } from "next/navigation";
import {
  BsEye,
  BsEyeFill,
  BsEyeSlash,
  BsPencilFill,
  BsTrashFill,
} from "react-icons/bs";
import Swal from "sweetalert2";
import { deletePostJob, handlerShowJobPost } from "../action";
import { DescriptionsModal } from "../modal/descriptionsModal";
import { JobPost, JobPostDescription } from "../schema";

interface DataTableProps<TData extends JobPost, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  closeNextPage: boolean;
}

export function JobPostDataTable<TData extends JobPost, TValue>({
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState<any>(null);

  const [visibility, setVisibility] = useState(
    data.reduce((acc: any, post: any) => {
      acc[post.id] = post.show;
      return acc;
    }, {})
  );

  useEffect(() => {
    // Update key to force re-render when data changes
    setKey((prevKey) => prevKey + 1);
  }, [data]);
  useEffect(() => {
    console.log("data", data);
  }, [data]);
  useEffect(() => {
    router.push(`/jobPost?limit=${limit}`);
  }, []);

  const columnsWithToggle: ColumnDef<TData, TValue>[] = [
    ...columns,
    {
      id: "showToggle",
      header: "Show Post",
      cell: ({ row }) => (
        <button
          onClick={() =>
            handleToggleVisibility((row.original as { id: number }).id)
          }
        >
          {visibility[(row.original as { id: number }).id] ? (
            <BsEye />
          ) : (
            <BsEyeSlash />
          )}
        </button>
      ),
    },
    // {
    //   id: "description",
    //   header: "Description",
    //   cell: ({ row }) => (
    //     <div className="flex">
    //       <div className="flex">
    //         <button
    //           onClick={() =>
    //             handleOpenDescription((row.original as { id: number }).id)
    //           }
    //         >
    //           <button className="text-yellow-400 text-xl">
    //             <BsEyeFill />
    //           </button>
    //         </button>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link
            href={`/jobPost/${(row.original as { id: number }).id}/preview`}
          >
            <button className="text-blue-400 text-xl">
              <BsEyeFill />
            </button>
          </Link>
          <Link href={`/jobPost/${(row.original as { id: number }).id}`}>
            <button className="text-yellow-400 text-xl">
              <BsPencilFill />
            </button>
          </Link>
          <button
            onClick={() => handleDelete((row.original as { id: number }).id)}
            className="text-red-400 text-xl"
          >
            <BsTrashFill />
          </button>
        </div>
      ),
    },
  ];

  // Function to handle delete action
  const handleDelete = (postId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deletePostJob(postId);
        if (response.status) {
          Swal.fire({
            title: response.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: response.message,
            icon: "error",
          });
        }
      }
    });
  };

  const table = useReactTable({
    data,
    columns: columnsWithToggle,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleFilterChange = (event: { target: { value: any } }) => {
    setCurrentPage(1);
    setLoadings(true);
    setName(event.target.value);
    if (!event.target.value) {
      router.push(`/jobPost`);
      setLoadings(false);
      return;
    }
    if (limit) {
      router.push(`/jobPost?name=${event.target.value}&limit=${limit}&page=1`);
    }
    setLoadings(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (name !== "") {
      router.push(`/jobPost?name=${name}&limit=${limit}&page=${newPage}`);
    } else {
      router.push(`/jobPost?limit=${limit}&page=${newPage}`);
    }

    if (limit && name !== "") {
      router.push(`/jobPost?name=${name}&limit=${limit}&page=${newPage}`);
    } else {
      router.push(`/jobPost?limit=${limit}&page=${newPage}`);
    }
  };

  const handleLimitChange = (event: { target: { value: any } }) => {
    setCurrentPage(1);
    setLimit(event.target.value);
    if (name !== "") {
      router.push(`/jobPost?name=${name}&limit=${event.target.value}&page=1`);
    } else {
      router.push(`/jobPost?limit=${event.target.value}&page=1`);
    }

    if (limit && name !== "") {
      router.push(`/jobPost?name=${name}&limit=${event.target.value}&page=1`);
    } else {
      router.push(`/jobPost?limit=${event.target.value}&page=1`);
    }
  };

  const handleToggleVisibility = (postId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the visibility of this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const postVisibility = visibility[postId];
        await handlerShowJobPost(postId, !postVisibility);

        setVisibility((prev: any) => ({
          ...prev,
          [postId]: !prev[postId],
        }));
        Swal.fire("Changed!", "The visibility has been changed.", "success");
      }
    });
  };

  const handleOpenDescription = (postId: number) => {
    const post = data.find((p: JobPost) => p.id === postId);
    if (post) {
      const descriptions = post.descriptions
        .map((desc: JobPostDescription) => desc.description)
        .join(", ");
      setSelectedDescription(descriptions);
      setModalIsOpen(true);
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
          value={limit}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithToggle.length}
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
      {modalIsOpen && selectedDescription && (
        <DescriptionsModal
          descriptions={selectedDescription}
          onClose={() => setModalIsOpen(false)}
        />
      )}
    </div>
  );
}
