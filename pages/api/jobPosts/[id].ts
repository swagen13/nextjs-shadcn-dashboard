import type { NextApiRequest, NextApiResponse } from "next";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

const deserializeEditorContent = (html: string) => {
  const domParser = new DOMParser();
  const document = domParser.parseFromString(html, "text/html");
  const elements = Array.from(document.body.childNodes);

  return elements.map((element: any) => {
    if (!(element instanceof Element)) {
      return {
        type: "p",
        children: [{ text: element.textContent || "" }],
        id: null,
      };
    }

    const dataKey = element
      .querySelector("[data-key]")
      ?.getAttribute("data-key");
    let textContent = element.textContent || ""; // Use textContent to get the plain text without HTML tags
    textContent = textContent.replace(/<br\s*\/?>/g, "\n");

    return {
      type: "p",
      children: [{ text: textContent }],
      id: dataKey || null,
    };
  });
};

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

    if (result.length === 0) {
      return res.status(404).json({ error: "Job post not found" });
    }

    const jobPost = result[0];
    jobPost.description = deserializeEditorContent(jobPost.description);

    res.status(200).json(jobPost);
  } catch (error) {
    console.error("Error getting job post by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
