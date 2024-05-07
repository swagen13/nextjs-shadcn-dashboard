"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createUser } from "../action";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PutBlobResult } from "@vercel/blob";
import imageCompression from "browser-image-compression";

const initialState = {
  message: "",
  status: false,
};

export function AddForm() {
  const [state, formAction] = useFormState(createUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.status) {
        Swal.fire({
          title: state.message,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: state.message,
          icon: "error",
        });
      }
    }
  }, [state]);

  useEffect(() => {
    if (formRef.current) {
      // append image state to form
      const formData = new FormData(formRef.current);
      // log values in fields
      console.log("formData:", formData);

      // append image to form data
      if (image) {
        console.log("image image:", image.name);

        formData.append("image", image);
      }
    }
  }, [image]);

  function SubmitButton() {
    const { pending } = useFormStatus();

    //

    return (
      <Button
        type="submit"
        aria-disabled={pending}
        size="default"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Add
      </Button>
    );
  }

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
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add User</h1>
      </div>

      <form action={formAction} className="flex flex-wrap -mx-2" ref={formRef}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mb-4 w-full sm:w-1/2 px-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4 w-full sm:w-1/2 px-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className={
                    "mt-1 p-2 w-full border rounded-md focus:border-blue-500"
                  }
                  required
                />
              </div>
              <div className="mb-4 w-full px-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                  required
                />
              </div>
            </div>
            {/*  add image */}
            <div className="mb-4 w-full px-2">
              <Input
                type="file"
                id="image"
                name="image"
                required
                onChange={handleImageChange}
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
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddForm;
