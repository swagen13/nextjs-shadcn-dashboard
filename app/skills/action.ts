"use server";
import { z } from "zod";
import { EditSkillSchema, SkillSchema } from "./schema";

// postgres connection
import postgres from "postgres";
let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function getSkills(name: string | undefined, page: number) {
  if (!page) page = 1;

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    {
      if (!name) {
        const result = await sql`
          SELECT
            *
          FROM
            skills         
          LIMIT
            ${limit}
          OFFSET
            ${offset}
        `;
        return result;
      } else {
        const result = await sql`
          SELECT
            *
          FROM
            skills      
            WHERE    
            name ILIKE ${"%" + name + "%"}
          LIMIT
            ${limit}
          OFFSET
            ${offset}
        `;
        return result;
      }
    }
  } catch (error) {
    console.error("Error fetching subskills:", error);
    return [];
  }
}

// addSkill a new skill
export async function addSkill(formData: FormData) {
  const { name, description, translationsname } = SkillSchema.parse(
    Object.fromEntries(formData)
  );

  const id = Math.floor(Math.random() * 1000000);

  const skill = {
    name,
    description,
    translationsname,
  };

  try {
    await sql`
      INSERT INTO
        skills
        (id,name, description, translationsname)
      VALUES
        (${id},${skill.name}, ${skill.description}, ${skill.translationsname})
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

  try {
    const result = await sql`
      UPDATE
        skills
      SET
        name = ${name},
        description = ${description},
        translationsname = ${translationsname}
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
