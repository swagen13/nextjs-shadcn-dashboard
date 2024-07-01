"use server";
import postgres from "postgres";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// get posts from database
export async function getPosts() {
  const result = await sql`
    SELECT
      *
    FROM
      posts
  `;
  return result;
}

export async function filterSkill(parentId: string): Promise<any[]> {
  const result = await sql`
    SELECT
      *
    FROM
      subskills
    WHERE
      parentid = ${parentId}
  `;
  console.log("result", result);

  return result;
}

export async function filterSubSkill(parentId: string): Promise<any[]> {
  const result = await sql`
    SELECT
      *
    FROM
      childrenskills
    WHERE
      subskillid = ${parentId}
  `;
  console.log("result", result);

  return result;
}
