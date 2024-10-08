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
  const { job_title, wage, post_owner, show, description, skill_id } = formData;

  const currentTime = new Date().toISOString(); // Get the current time in ISO format

  try {
    // Perform the update if the job post exists
    await sql`
     INSERT INTO jobposts (job_title, wage, post_owner, skill_id, show, description, created_at, updated_at)
        VALUES (${job_title}, ${wage}, ${post_owner}, ${skill_id}, ${show}, ${description}, ${currentTime}, ${currentTime})
        RETURNING id;
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
