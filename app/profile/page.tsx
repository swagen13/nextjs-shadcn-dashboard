"use client";

import { useEffect, useRef, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/pages/api/action";
import { useFormState, useFormStatus } from "react-dom";
import Swal from "sweetalert2";

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

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const userProfile = await getUserProfile();
    setUser(userProfile);
    setImage(userProfile!.photoURL);
  };

  const initialState = {
    message: "",
  };

  const [state, formAction] = useFormState(updateUserProfile, initialState);

  useEffect(() => {
    if (state.message != "") {
      Swal.fire({
        title: state.message,
        icon: "success",
      });
      state.message = "";
    }
  }, [state.message]); // Include params.id in the dependency array

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        aria-disabled={pending}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md"
      >
        {pending ? "Submitting..." : "Edit"}
      </button>
    );
  }

  // Function to handle image change when selected from input file
  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0]; // Get the selected image file
    const imageURL = URL.createObjectURL(selectedImage); // Create a URL for the selected image
    setImage(imageURL); // Set the image URL to the state
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <form
        action={formAction}
        className="flex flex-wrap -mx-2 "
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(formRef.current!);
          formAction(formData);
        }}
      >
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mb-4 w-full px-2">
                  <label
                    htmlFor="photoURL"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Photo
                  </label>
                  <img
                    src={image}
                    alt="user photo"
                    className="w-40  rounded-md"
                  />
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
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>
                <input type="hidden" name="uid" value={user.uid} />
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={user?.displayName || ""}
                  onChange={(e) =>
                    setUser((prevUser) =>
                      prevUser
                        ? { ...prevUser, displayName: e.target.value }
                        : null
                    )
                  }
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
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user?.email || ""}
                  onChange={(e) =>
                    setUser((prevUser) =>
                      prevUser ? { ...prevUser, email: e.target.value } : null
                    )
                  }
                  className="mt-1 p-2 w-full border rounded-md focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4 w-full px-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={user?.phoneNumber || ""}
                  onChange={(e) =>
                    setUser((prevUser) =>
                      prevUser
                        ? { ...prevUser, phoneNumber: e.target.value }
                        : null
                    )
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
