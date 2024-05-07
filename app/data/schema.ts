import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

// Define the interface for user data
export interface UserData {
  id: string;
  username: string;
  email: string;
  password: string;
  image: string;
  // Add more fields as needed
}

// Define the interface for the value types of the columns
export interface ColumnValueTypes {
  id: number;
  username: string;
  email: string;
  password: string;
  image: string;
  // Add more fields as needed
}

// Define the interface for column definitions
export interface ColumnDefinition<TValue> {
  header: React.ReactNode; // ReactNode for header content
  cell: (rowData: TValue) => React.ReactNode; // Function to render cell content
}

// Define the interface for DataTable props
export interface DataTableProps {
  columns: ColumnDefinition<ColumnValueTypes>[]; // Array of column definitions
  data: UserData[]; // Array of user data
}
