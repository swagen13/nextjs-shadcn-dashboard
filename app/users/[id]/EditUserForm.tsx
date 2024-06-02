// components/EditUserForm.tsx
"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { updateUser } from "../action";
import { EditUserSchema, EditUserSchemaType } from "../schema";

interface EditUserFormProps {
  userData: {
    id: number;
    username: string;
    email: string;
    password: string;
    image: string;
  };
}

const initialState = {
  message: "",
  status: false,
};

export default function EditUserForm({ userData }: any) {
  const formRef = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userData.image
  );

  const form = useForm<EditUserSchemaType>({
    context: { mode: "onBlur" },
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      id: userData.id.toString(),
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("image", image!);
    formData.append("id", data.id);

    const response = await updateUser(formData);

    if (response.status) {
      Swal.fire({
        title: "User updated successfully",
        icon: "success",
      });
      reset();
      formRef.current?.reset();
      setImage(null);
    } else {
      Swal.fire({
        title: "Failed to update user",
        icon: "error",
      });
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-wrap -mx-2" ref={formRef}>
        {" "}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mb-4 w-full sm:w-1/2 px-2">
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
              <div className="mb-4 w-full sm:w-1/2 px-2">
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
            <div className="sm:flex sm:items-start">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected Profile"
                  className="mb-4 w-32 h-32 object-cover rounded-md"
                />
              ) : (
                <Spinner />
              )}
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
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="submit"
              disabled={!isValid}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <Spinner size={20} />
              ) : (
                <div className="flex items-center justify-center">
                  <User size="20" className="mr-2" />
                  Update Profile
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
