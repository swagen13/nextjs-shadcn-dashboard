"use client";

import { ColumnDef } from "@tanstack/react-table";

export const jobPostColumns: ColumnDef<any>[] = [
  {
    accessorKey: "job_title",
    header: "Job Title",
  },
  {
    accessorKey: "wage",
    header: "Wage",
  },
  {
    accessorKey: "post_owner",
    header: "Post Owner",
  },
];
