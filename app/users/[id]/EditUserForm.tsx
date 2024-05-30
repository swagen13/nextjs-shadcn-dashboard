// components/EditUserForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateUser } from "../action";
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2";

interface EditUserFormProps {
  userData: {
    id: string;
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

export default function EditUserForm({ userData }: EditUserFormProps) {
  const [username, setUsername] = useState(userData.username);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState(userData.password);
  const [state, formAction] = useFormState(updateUser, initialState);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userData.image
  );

  useEffect(() => {
    if (state.message === "") {
      return;
    } else {
      if (state.status) {
        Swal.fire({
          title: state.message,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: state.message,
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
        Update
      </Button>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  return (
    <form action={formAction} className="flex flex-wrap -mx-2">
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mb-4 w-full sm:w-1/2 px-2">
              <input type="hidden" name="id" value={userData.id} />
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:border-blue-500"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                required
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
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <SubmitButton />
          <Button
            type="reset"
            size="default"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-2 mr-2"
          >
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}
