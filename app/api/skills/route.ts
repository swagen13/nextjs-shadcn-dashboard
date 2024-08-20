import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

interface SkillData {
  id: string | null;
  name: string;
  color: string | null;
  description: string | null;
  icon: string | null;
  skill_image: string | null;
  parent_id: string | null;
  sequence: string | null;
  slug: string;
  locale: string;
  translation_name: string;
  level?: number; // Optional, if it might not always be present
  [key: string]: any; // Allow other properties to exist
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const result = await sql`
      WITH RECURSIVE SkillHierarchy AS (
        SELECT
          id,
          name,
          parent_id,
          sequence,
          color,
          description,
          icon,
          skill_image,
          CASE
            WHEN parent_id IS NULL OR parent_id = '' THEN 0
            ELSE COALESCE(
              LENGTH(sequence) - LENGTH(REPLACE(sequence, '.', '')) - 1, 
              0
            )
          END AS level
        FROM
          skills
        WHERE 
          parent_id IS NULL OR parent_id = ''
        UNION ALL
        SELECT
          s.id,
          s.name,
          s.parent_id,
          s.sequence,
          s.color,
          s.description,
          s.icon,
          s.skill_image,
          sh.level + 1 AS level
        FROM
          skills s
        INNER JOIN SkillHierarchy sh ON s.parent_id = sh.id
      )
      SELECT
        sh.id,
        sh.name,
        sh.parent_id,
        sh.sequence,
        sh.level,
        sh.color,
        sh.description,
        sh.icon,
        sh.skill_image,
        st.locale,
        st.name as translation_name
      FROM
        SkillHierarchy sh
      LEFT JOIN
        skill_translations st
      ON
        sh.id = st.skill_id
      ORDER BY
        sh.sequence ASC;
      `;

    // Use this function when processing data
    const skillData: SkillData[] = transformToSkillData(result);

    // Return the list of skills
    return NextResponse.json(skillData);
  } catch (error) {
    console.error("Error fetching skillssss:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function transformToSkillData(rawData: any[]): SkillData[] {
  return rawData.map((item) => ({
    id: item.id || null,
    name: item.name || "",
    color: item.color || null,
    description: item.description || null,
    icon: item.icon || null,
    skill_image: item.skill_image || null,
    parent_id: item.parent_id || null,
    sequence: item.sequence || null,
    slug: item.slug || "",
    locale: item.locale || "",
    translation_name: item.translation_name || "",
    level: item.level || 0, // Default or calculate if needed
  }));
}
