import { NextResponse } from "next/server";
import postgres from "postgres";

// Create a PostgreSQL client instance
const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// Define the type for JobPost
type JobPost = {
  id: number;
  job_title: string;
  wage: number;
  post_owner: number;
  post_owner_name: string;
  show: boolean;
  description: string;
  skill_id: number;
  created_at: string;
  updated_at: string;
};

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    // Perform the SQL query to get the job post by ID
    const result = await sql<JobPost[]>`
      SELECT
        jp.id,
        jp.job_title,
        jp.wage,
        jp.post_owner,
        u.username AS post_owner_name,
        jp.show,
        jp.description,
        jp.skill_id,
        jp.created_at,
        jp.updated_at
      FROM
        JobPosts jp
      LEFT JOIN
        users u ON jp.post_owner::integer = u.id
      WHERE
        jp.id = ${id}
      GROUP BY
        jp.id, u.username;
    `;

    // Check if result is empty
    if (result.length === 0) {
      return NextResponse.json(
        { message: "Job post not found" },
        { status: 404 }
      );
    }

    // Return the found job post
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching job post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
