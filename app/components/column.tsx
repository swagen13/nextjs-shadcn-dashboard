// column.tsx

// Define the type for the value types of the columns
interface ColumnValueTypes {
  id: number;
  username: string;
  email: string;
  // Add more fields as needed
}

// Define the column definition interface
interface ColumnDefinition {
  accessorKey: keyof ColumnValueTypes; // Key of the field in the UserData interface
  header: string; // Header label
}

// Define the column definitions
const userColumns: ColumnDefinition[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  // Add more columns as needed
];

// Export the columns
export const columns = userColumns;
