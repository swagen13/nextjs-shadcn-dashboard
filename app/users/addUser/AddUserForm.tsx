"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { createUser } from "../action";
import { UserSchema, UserSchemaType } from "../schema";
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

const initialState = {
  message: "",
  status: false,
};

export default function AddUserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const form = useForm<UserSchemaType>({
    context: { mode: "onBlur" },
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid, errors } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("image", image!);

    const response = await createUser(formData);

    if (response.status) {
      Swal.fire({
        title: "User added successfully",
        icon: "success",
      });
      reset();
      formRef.current?.reset();
      setImage(null);
    } else {
      Swal.fire({
        title: "Failed to add user",
        icon: "error",
      });
    }
  });

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    // Display loading indicator while processing
    setImageLoading(true);

    // set the original image file
    setImage(file);
    // remove loading indicator
    setImageLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-wrap -mx-2" ref={formRef}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mb-4 w-full px-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 w-full px-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 w-full px-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/*  add image */}
            <div className="mb-4 w-full px-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* display example image */}
            {imageLoading ? (
              <div
                // display center image
                className="flex justify-center items-center w-full h-64"
              >
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                Loading...
              </div> // Display loading indicator while processing
            ) : (
              // Display selected image preview if not loading
              image && (
                <div className="mb-4 w-full px-2">
                  <label
                    htmlFor="selectedImage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Selected Image Preview
                  </label>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected Image"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                  />
                </div>
              )
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              size="default"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md self-end"
              type="submit"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
