import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// Define the type for job post records
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

export const dynamic = "force-dynamic";

// Handler for GET requests
export async function GET(request: Request) {
  const url = new URL(request.url);
  const skill_ids = url.searchParams.get("skill_ids");
  const user_id = url.searchParams.get("user_id"); // Assuming you want to pass user_id as a query parameter

  if (skill_ids) {
    // Handle fetching job posts by multiple skill IDs
    const skillIdsArray = skill_ids.split(",").map((id) => id.trim());

    try {
      const result: JobPost[] = await sql`
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
          jp.updated_at,
          COALESCE(sjp.job_post_id IS NOT NULL, false) AS is_selected
        FROM
          JobPosts jp
        LEFT JOIN
          users u ON jp.post_owner::integer = u.id
        LEFT JOIN
          selected_job_posts sjp ON jp.id::text = sjp.job_post_id AND sjp.user_id = ${user_id}
        WHERE
          jp.skill_id = ANY(${sql.array(skillIdsArray)}::text[])
        GROUP BY
          jp.id, u.username, sjp.job_post_id;
      `;

      return NextResponse.json(result);
    } catch (error) {
      console.error("Error fetching job posts by skill IDs:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else {
    // Handle fetching all job posts
    try {
      const result: JobPost[] = await sql`
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
          jp.updated_at,
          COALESCE(sjp.job_post_id IS NOT NULL, false) AS is_selected
        FROM
          JobPosts jp
        LEFT JOIN
          users u ON jp.post_owner::integer = u.id
        LEFT JOIN
          selected_job_posts sjp ON jp.id::text = sjp.job_post_id AND sjp.user_id = ${user_id}
        GROUP BY
          jp.id, u.username, sjp.job_post_id;
      `;

      return NextResponse.json(result);
    } catch (error) {
      console.error("Error fetching all job posts:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
