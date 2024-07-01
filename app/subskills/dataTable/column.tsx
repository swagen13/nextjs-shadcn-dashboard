"use client";

import { UserData } from "@/app/data/schema";
import { ColumnDef } from "@tanstack/react-table";

export const skillsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "skill_name",
    header: "Name",
  },

  {
    accessorKey: "createdat",
    header: "Created At",
  },
  {
    accessorKey: "updatedat",
    header: "Updated At",
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
