import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// Define the type for skill records

export async function GET(request: Request) {
  try {
    // Perform the SQL query to get all skills
    const result = await sql`
      SELECT
        *
      FROM
        skillstest;
    `;

    // Return the list of skills
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
