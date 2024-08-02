import type { NextApiRequest, NextApiResponse } from "next";
import postgres from "postgres";

// Initialize the connection to the database
const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Parse the skill_ids query parameter
  const { skill_ids } = req.query;

  // If skill_ids is not provided, return a bad request response
  if (!skill_ids || typeof skill_ids !== "string") {
    return res
      .status(400)
      .json({ error: "skill_ids query parameter is required" });
  }

  // Split the skill_ids string into an array of strings
  const skillIdsArray = skill_ids.split(",").map((id) => id.toString());

  try {
    // Perform the SQL query
    const result = await sql`
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
        jp.skill_id = ANY(${sql.array(skillIdsArray)}::text[])
      GROUP BY
        jp.id, u.username;
    `;

    // Return the result as a JSON response
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching job posts by skill IDs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
