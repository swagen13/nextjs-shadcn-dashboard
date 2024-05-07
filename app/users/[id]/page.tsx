"use client";

import { useEffect, useState } from "react";
import { UserData } from "@/app/data/schema";
import Swal from "sweetalert2";
import { getUserById, updateUser } from "../action";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const initialState = {
  message: "",
};

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

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const [state, formAction] = useFormState(updateUser, initialState);

  useEffect(() => {
    getUserById(params.id).then((data) => {
      // Assuming getUserById returns an array, get the first item
      const userDataFromApi = data[0];
      if (userDataFromApi) {
        setUserData(userDataFromApi);
        setUsername(userDataFromApi.username);
        setEmail(userDataFromApi.email);
        setPassword(userDataFromApi.password);
        setImage(userDataFromApi.image);
      }
    });
  }, [params.id]); // Include params.id in the dependency array

  useEffect(() => {
    if (state.message != "") {
      Swal.fire({
        title: state.message,
        icon: "success",
      });
      state.message = "";
    }
  }, [state.message]); // Include params.id in the dependency array

  // Function to handle image change when selected from input file
  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0]; // Get the selected image file
    const imageURL = URL.createObjectURL(selectedImage); // Create a URL for the selected image
    setImage(imageURL); // Set the image URL to the state
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Edit User: {userData.username}</h1>
      </div>

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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-4 w-full px-2">
              <Input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
              />
            </div>
            {/* display example image */}
            {image && (
              <Image
                src={image}
                alt="Selected Image"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                width={200}
                height={200}
              />
            )}

            {/* Display the image retrieved from the database */}
            {userData.image && !image && (
              <Image
                src={userData.image}
                alt="User Image"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                width={200}
                height={200}
              />
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <SubmitButton />
            <Button
              type="reset"
              size="default"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-2"
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
