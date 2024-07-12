"use client";

import { UserData } from "@/app/data/schema";
import { ColumnDef } from "@tanstack/react-table";

export const skillsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "skill_name",
    header: "Name",
  },
  {
    accessorKey: "parent_id",
    header: "Parent ID",
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
