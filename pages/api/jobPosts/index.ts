import type { NextApiRequest, NextApiResponse } from "next";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      GROUP BY
        jp.id, u.username;
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "No job posts found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting job posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
