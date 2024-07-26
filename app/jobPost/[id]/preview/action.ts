import postgres from "postgres";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function getJobPostById(jobPostId: number) {
  try {
    const result = await sql`
        SELECT
          jp.id,
          jp.job_title,
          jp.wage,
          jp.post_owner,
          u.username AS post_owner_name, 
          jp.show,
          jp.description,
          jp.created_at,
          jp.updated_at
        FROM
          JobPosts jp
        LEFT JOIN
          users u ON jp.post_owner::integer = u.id
        WHERE
          jp.id = ${jobPostId}
        GROUP BY
          jp.id, u.username; -- เพิ่ม u.username ใน GROUP BY
      `;

    return result;
  } catch (error) {
    console.error("Error getting job post by ID:", error);
    return null;
  }
}
