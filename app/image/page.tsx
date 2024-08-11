"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Swal from "sweetalert2";
import { UploadImage } from "../users/action";

const initialState = {
  message: "",
  status: false,
};

export default function ImageUpload() {
  const [state, formAction] = useFormState(UploadImage, initialState);
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

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        aria-disabled={pending}
        size="default"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Upload
      </Button>
    );
  }

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    // Display loading indicator while processing
    setImageLoading(true);

    // get image size
    const fileSize = file.size / 1024 / 1024; // in MB

    // check if image size is greater than 1MB
    // if (fileSize > 1) {
    //   // re-quality the image
    //   const options = {
    //     maxSizeMB: 1,
    //   };

    //   // compress the image
    //   const compressedImage = await imageCompression(file, options);

    //   // convert compressed image to file
    //   const compressedImageFile = new File([compressedImage], file.name, {
    //     type: file.type,
    //   });

    //   // set the compressed image file
    //   setImage(compressedImageFile);
    //   // remove loading indicator
    //   setImageLoading(false);

    //   // return the compressed image file
    //   return compressedImageFile;
    // }

    // set the original image file
    setImage(file);
    // remove loading indicator
    setImageLoading(false);
  };

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Image Upload</h1>
      </div>

      <form action={formAction} className="flex flex-wrap -mx-2">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
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
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Selected Image"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                    width={200}
                    height={200}
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
