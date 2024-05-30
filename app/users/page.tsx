import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUsers } from "./action";
import { customColumns } from "./data-table/column";
import { DataTable } from "./data-table/dataTable";

async function UserPage() {
  // get users from getUsers
  const users = await getUsers();

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold text-center mt-10">User Page</h1>
        <Link rel="preload" href="/users/addUser">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Create User
          </Button>
        </Link>
      </div>
      <DataTable data={users} columns={customColumns} />
    </div>
  );
}
export default UserPage;
