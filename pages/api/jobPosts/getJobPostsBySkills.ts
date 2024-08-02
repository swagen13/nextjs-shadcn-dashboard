import { NextApiRequest, NextApiResponse } from "next";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Extract skill_ids from query parameters
    const { skill_ids } = req.query;

    if (!skill_ids) {
      return res
        .status(400)
        .json({ error: "skill_ids query parameter is required" });
    }

    // Convert skill_ids to an array of numbers
    const skillIdsArray = Array.isArray(skill_ids)
      ? skill_ids
      : skill_ids.split(",");

    // Query the database
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
        jp.skill_id = ANY(${sql(skillIdsArray)})
      GROUP BY
        jp.id, u.username;
    `;

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
