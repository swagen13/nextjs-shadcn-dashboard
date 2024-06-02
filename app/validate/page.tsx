"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JokeSchema = z.object({
  content: z.string().min(5, {
    message: "Content must be at least 5 characters long",
  }),
  id: z.string().optional(),
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long",
  }),
  file: z.instanceof(File).optional(),
});

export default function ReactHookForm() {
  const form = useForm<z.infer<typeof JokeSchema>>({
    resolver: zodResolver(JokeSchema),
    defaultValues: {
      content: "",
      name: "",
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid, errors } = formState;

  const onSubmit = handleSubmit((data) => {
    console.log("data", data);
    reset();
  });

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-6" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is a description for the input field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is a description for the input field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                {/* <Input type="file" 
                    accept="image/*" {...field}
                /> */}
              </FormControl>
              <FormDescription>
                This is a description for the input field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
