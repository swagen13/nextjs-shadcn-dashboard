"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { customColumns } from "./data-table/column";
import { DataTable } from "./data-table/dataTable";
import { deleteUser, getUsers } from "./action";
import { UserData } from "../data/schema";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../firebaseConfig";

const UserPage = () => {
  const [userData, setUserData] = useState([] as UserData[]);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);

    getUsers().then((data) => {
      setUserData(data);
    });
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await deleteUser(id);
      if (response.message === "User deleted successfully") {
        Swal.fire({
          title: "User deleted successfully",
          icon: "success",
        });
        // Update userData state by filtering out the deleted user
        setUserData((prevData) => prevData.filter((user) => user.id !== id));
      } else {
        Swal.fire({
          title: "Error deleting user",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Trigger error alert
      alert("Error deleting user");
    }
  };

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/users/addUser">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add User
          </Button>
        </Link>
      </div>

      {/* Pass the handleDeleteUser function to the DataTable component */}
      <DataTable
        data={userData}
        columns={customColumns}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};
export default UserPage;
