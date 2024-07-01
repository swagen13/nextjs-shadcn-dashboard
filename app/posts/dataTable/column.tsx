"use client";

import { UserData } from "@/app/data/schema";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const subSkillsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "header",
    header: "Header",
  },
  {
    accessorKey: "skill",
    header: "Skill",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "wages",
    header: "Wages",
  },
  {
    accessorKey: "worker",
    header: "Worker",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
