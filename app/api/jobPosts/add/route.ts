// app/api/jobPosts/edit/route.ts
import { NextResponse } from "next/server";

import postgres from "postgres";

// Create a PostgreSQL client instance
const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function POST(request: Request) {
  const formData = await request.json();

  // Destructure the form data
  const { description, id, show, job_title, wage, post_owner, skill_id } =
    formData;

  try {
    // Perform the update if the job post exists
    await sql`
      UPDATE JobPosts
      SET
        description = ${description},
        show = ${show},
        job_title = ${job_title},
        wage = ${wage},
        post_owner = ${post_owner},
        skill_id = ${skill_id}
      WHERE id = ${id};
    `;

    return NextResponse.json(
      { message: "Job post updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json(
    { message: "Only POST method is allowed" },
    { status: 405 }
  );
}
