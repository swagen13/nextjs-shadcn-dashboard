"use client";

import React from "react";

import { cn } from "@udecode/cn";
import {
  CommentResolveButton as CommentResolveButtonPrimitive,
  useComment,
} from "@udecode/plate-comments";

// import { Icons } from '@/components/icons';

import { buttonVariants } from "./button";
import { BsArrowClockwise, BsCheck } from "react-icons/bs";

export function CommentResolveButton() {
  const comment = useComment()!;

  return (
    <CommentResolveButtonPrimitive
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-6 p-1 text-muted-foreground"
      )}
    >
      {comment.isResolved ? (
        <BsArrowClockwise className="size-4" />
      ) : (
        <BsCheck className="size-4" />
      )}
    </CommentResolveButtonPrimitive>
  );
}
