"use client";

import { UserData } from "@/app/data/schema";
import { ColumnDef } from "@tanstack/react-table";

export const customColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
];
