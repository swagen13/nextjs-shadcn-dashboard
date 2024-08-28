// app/api/jobPosts/edit/route.ts
import { NextResponse } from "next/server";

import postgres from "postgres";

// Create a PostgreSQL client instance
const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.json();
  const { user_id, job_post_id } = formData;
  const currentTime = new Date();

  try {
    // Check if the job post is already selected by the user
    const existingRows = await sql`
    SELECT * FROM selected_job_posts
    WHERE user_id::varchar = ${user_id.toString()} AND job_post_id::varchar = ${job_post_id.toString()}
  `;

    if (existingRows.length > 0) {
      // If the job post is already selected, delete the row
      await sql`
          DELETE FROM selected_job_posts
          WHERE user_id::varchar = ${user_id.toString()} AND job_post_id::varchar = ${job_post_id.toString()}
        `;

      return NextResponse.json(
        { message: "Job post deleted successfully" },
        { status: 200 }
      );
    } else {
      // If the job post is not selected, insert a new row
      await sql`
          INSERT INTO selected_job_posts (user_id, job_post_id, selected_at)
          VALUES (${user_id.toString()}, ${job_post_id.toString()}, ${currentTime})
        `;

      return NextResponse.json(
        { message: "Job post added successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing job post:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
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
