"use server";
import { z } from "zod";
import { EditSkillSchema, SkillSchema } from "./schema";

// postgres connection
import postgres from "postgres";
let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function getSkills() {
  try {
    const result = await sql`
          SELECT
            *
          FROM
            skillstest 
          WHERE
            parent_id IS NULL            
        `;
    return result;
  } catch (error) {
    console.error("Error fetching subskills:", error);
    return [];
  }
}

export async function getSubSkills(parentIds: string | any[]) {
  if (parentIds.length === 0) return [];

  try {
    const result = await sql`
      SELECT
        *
      FROM
        skillstest
      WHERE
        parent_id IN  (SELECT parent_id FROM skillstest WHERE parent_id IS NOT NULL)
    `;
    return result;
  } catch (error) {
    console.error("Error fetching subskills:", error);
    return [];
  }
}

async function getSubSkillsByParentId(parent_id: string) {}

// addSkill a new skill
export async function addSubSkill(formData: FormData) {
  const { skill_name, parent_id } = SkillSchema.parse(
    Object.fromEntries(formData)
  );

  const skill = {
    skill_name,
    parent_id,
    createdat: new Date(),
  };

  console.log("skill", skill);

  try {
    await sql`
      INSERT INTO
        skillstest
        (skill_name,parent_id, createdat,updatedat)
      VALUES
        (${skill.skill_name}, ${skill.parent_id}, ${skill.createdat},${skill.createdat})
    `;

    // return success message
    return { message: "Skill created successfully", status: true };
  } catch (error) {
    console.error("Error creating skill:", error);

    return { message: "Error creating skill" };
  }
}

// get skill by id
export async function getSkillById(id: string) {
  try {
    const result = await sql`
      SELECT
        *
      FROM
        skills
      WHERE
        id = ${id}
    `;

    if (result.length) {
      return result[0];
    } else {
      return { message: "Skill not found", status: false };
    }
  } catch (error) {
    console.error("Error fetching skill:", error);
    return { message: "Error fetching skill" };
  }
}

// update skill by id
export async function updateSkill(formData: FormData) {
  const { id, name, description, translationsname } = EditSkillSchema.parse(
    Object.fromEntries(formData)
  );

  const updatedat = new Date();

  try {
    const result = await sql`
      UPDATE
        skills
      SET
        name = ${name},
        description = ${description},
        translationsname = ${translationsname},
        updatedat = ${updatedat}
      WHERE
        id = ${id}
    `;

    return { message: "Skill updated successfully", status: true };
  } catch (error) {
    console.error("Error updating skill:", error);
    return { message: "Error updating skill" };
  }
}

// get skills from skills table
export async function getAllSkills() {
  try {
    const result = await sql`
      SELECT
        *
      FROM
        skills
    `;
    return result;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}
