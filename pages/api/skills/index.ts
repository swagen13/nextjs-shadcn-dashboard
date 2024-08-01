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
         *
      FROM
        skillstest;
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "No skills found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting skills:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
