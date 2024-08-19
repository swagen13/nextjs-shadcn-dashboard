import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// Define the type for the skill result
type Skill = {
  id: number;
  // Add other fields from skillstest table as needed
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate the ID
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    // Perform the SQL query to get the skill by ID
    const result: Skill[] = await sql`
      SELECT
        *
      FROM
        skills
      WHERE
        id = ${id};
    `;

    // Check if result is empty
    if (result.length === 0) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Return the found skill
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error getting skill by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
