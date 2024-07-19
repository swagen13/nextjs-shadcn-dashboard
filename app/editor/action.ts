"use server";

// postgres connection
import postgres from "postgres";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function addContent(serializedContent: any) {
  try {
    await sql`INSERT INTO editor_contents (content) VALUES (${serializedContent})`;
    return {
      message: "Content added successfully",
      status: true,
    };
  } catch (error) {
    console.error("Error adding job post:", error);
    return {
      message: "Error adding job post",
      status: false,
    };
  }
}

export async function fetchContent() {
  try {
    const content = await sql`
        SELECT content FROM editor_contents
        ORDER BY created_at DESC
        LIMIT 1
      `;
    return content.length ? content[0].content : null;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}
