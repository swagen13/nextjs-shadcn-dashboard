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
    return res.status(400).json({ error: "Skill ID is required" });
  }

  try {
    const result = await sql`
      SELECT
       *
      FROM
        skillstest
      WHERE
        id = ${id};
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error getting skill by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
