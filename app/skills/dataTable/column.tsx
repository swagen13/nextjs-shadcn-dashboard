"use client";

import { UserData } from "@/app/data/schema";
import { ColumnDef } from "@tanstack/react-table";

export const skillsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "parentId",
    header: "Parent Id",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
