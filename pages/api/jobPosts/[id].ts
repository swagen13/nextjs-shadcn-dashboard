import type { NextApiRequest, NextApiResponse } from "next";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Job post ID is required" });
  }

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
        jp.id = ${id}
      GROUP BY
        jp.id, u.username;
    `;

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error getting job post by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
