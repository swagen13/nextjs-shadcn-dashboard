"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Swal from "sweetalert2";
import { getUserProfile, updateUserProfile } from "../users/action";
import Spinner from "@/components/Spinner";
import { ProfileSchema, ProfileSchemaType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  createdAt: string;
  disabled: boolean;
  displayName?: string;
  email: string;
  emailVerified: boolean;
  lastLoginAt: string;
  phoneNumber: string;
  photoURL?: string;
  providerEmail: string;
  providerId: string;
  providerUid: string;
  uid: string;
}

export default function EditProfileForm({ userData }: any) {
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState(userData?.photoURL);
  const [image, setImage] = useState<File | null>(null);

  const initialState = {
    message: "",
  };

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: userData.displayName,
      email: userData.email,
      phone: userData.phoneNumber,
      uid: userData.uid,
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid } = formState;

  // Function to handle image change when selected from input file
  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0]; // Get the selected image file
    setImage(selectedImage); // Set the image to the state
    const imageURL = URL.createObjectURL(selectedImage); // Create a URL for the selected image
    setImagePreview(imageURL); // Set the image URL to the state
  };

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("displayName", data.displayName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("uid", userData.uid);
    formData.append("image", image!);

    const response = await updateUserProfile(formData);

    if (response.status) {
      Swal.fire({
        title: "User added successfully",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Failed to add user",
        icon: "error",
      });
    }
  });

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-wrap -mx-2" ref={formRef}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mb-4 w-full px-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Photo
                  </label>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="User Avatar"
                      className="rounded-md mx-auto min-h-fit"
                      width={200}
                      height={200}
                    />
                  ) : (
                    <Spinner />
                  )}
                </div>
                <div className="mb-4 w-full px-2">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Change Photo
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mb-4 w-full sm:w-1/2 px-2">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 w-full px-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
