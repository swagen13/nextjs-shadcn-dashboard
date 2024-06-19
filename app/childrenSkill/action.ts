"use server";
import postgres from "postgres";
import { ChidrentSkillSchema } from "./schema";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// get children skills
export async function getChildrenSkills() {
  try {
    const result = await sql`
      SELECT
        *
      FROM
        childrenskills
    `;
    return result;
  } catch (error) {
    console.error("Error fetching subskills:", error);
    return [];
  }
}

// get subskill by skill id
export async function getSubSkillByParent(skillId: string) {
  try {
    const result = await sql`
      SELECT
        *
      FROM
        subskills
      WHERE
        parentId = ${skillId}
    `;
    return result;
  } catch (error) {
    console.error("Error fetching subskills:", error);
    return [];
  }
}

// get subskill and count children
export async function getSubSkillsWithChildrenCount(parentId: string) {
  try {
    const result = await sql`
      SELECT
        subskills.*,
        COUNT(childrenskills.id) as children_count
      FROM
        subskills
      LEFT JOIN
        childrenskills
      ON
        subskills.id = childrenskills.subskillid
      WHERE
        subskills.parentid = ${parentId}
      GROUP BY
        subskills.id
    `;
    return result;
  } catch (error) {
    console.error("Error fetching subskills:", error);
    return [];
  }
}

// delete child skills
export async function deleteChildSkill(id: string) {
  try {
    const result = await sql`
      DELETE FROM
        childrenskills
      WHERE
        id = ${id}
    `;
    return { message: "Skill deleted successfully", status: true };
  } catch (error) {
    return { message: "Error deleting skill", status: false };
  }
}

// add child skills
export async function addChildSkill(formData: FormData) {
  const { name, description, translationsname, subskillid } =
    ChidrentSkillSchema.parse(Object.fromEntries(formData));
  try {
    const result = await sql`
      INSERT INTO
        childrenskills
        (name, description, translationsname, subskillid)
      VALUES
        (${name}, ${description}, ${translationsname}, ${subskillid})
    `;
    return { message: "Skill added successfully", status: true };
  } catch (error) {
    return { message: "Error adding skill", status: false };
  }
}
// get chidrent skills by subskillid
export async function getChildrenSkillsBySubSkillId(subSkillId: string) {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        subskillid
      FROM
        childrenskills
      WHERE
        subskillid = ${subSkillId}
    `;
    console.log("result", result);

    return result;
  } catch (error) {
    console.error("Error fetching children skills:", error);
    return [];
  }
}

// get all subskills
export async function getAllSubSkills() {
  try {
    const result = await sql`
      SELECT
        id,
        name        
      FROM
        subskills
    `;
    console.log("subskills", result);

    return result;
  } catch (error) {
    console.error("Error fetching subskills:", error);
    return [];
  }
}
