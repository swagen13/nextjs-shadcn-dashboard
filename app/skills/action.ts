"use server";
import { EditSkillSchema, SkillSchema } from "./schema";

// postgres connection
import postgres from "postgres";
let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function getSkills(page: number, limit: number, name?: string) {
  if (!page) page = 1;
  if (!limit) limit = 10;

  if (name) {
    console.log("name", name);
  }

  try {
    const offset = (page - 1) * limit; // Calculate OFFSET
    let query;

    // Add WHERE clause if name is provided
    if (name && name.trim() !== "") {
      query = sql`
        WITH RECURSIVE SkillHierarchy AS (
          SELECT
            id,
            skill_name,
            parent_id,
            sequence,
            0 AS level
          FROM
            skillstest
          WHERE
            parent_id IS NULL
          UNION ALL
          SELECT
            s.id,
            s.skill_name,
            s.parent_id,
            s.sequence,
            sh.level + 1 AS level
          FROM
            skillstest s
          INNER JOIN SkillHierarchy sh ON s.parent_id::INTEGER = sh.id
        )
        SELECT
          *
        FROM
          SkillHierarchy
        WHERE
          skill_name LIKE ${"%" + name + "%"}
        ORDER BY
          sequence ASC
        LIMIT ${limit + 1}
        OFFSET ${offset};
      `;
    } else {
      query = sql`
        WITH RECURSIVE SkillHierarchy AS (
          SELECT
            id,
            skill_name,
            parent_id,
            sequence,
            0 AS level
          FROM
            skillstest
          WHERE
            parent_id IS NULL
          UNION ALL
          SELECT
            s.id,
            s.skill_name,
            s.parent_id,
            s.sequence,
            sh.level + 1 AS level
          FROM
            skillstest s
          INNER JOIN SkillHierarchy sh ON s.parent_id::INTEGER = sh.id
        )
        SELECT
          *
        FROM
          SkillHierarchy
        ORDER BY
          sequence ASC
        LIMIT ${limit + 1}
        OFFSET ${offset};
      `;
    }

    const result = await query;

    return result;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

// addSkill a new skill
export async function addSkill(formData: FormData) {
  const { skill_name, parent_id, sequence } = SkillSchema.parse(
    Object.fromEntries(formData)
  );

  const skill = {
    skill_name,
    parent_id,
    sequence,
    createdat: new Date(),
  };

  console.log("skill", skill);

  try {
    await sql`
      INSERT INTO
        skillstest
        (skill_name, parent_id, sequence, createdat,updatedat)
      VALUES
        (${skill.skill_name}, ${skill.parent_id}, ${skill.sequence}, ${skill.createdat},${skill.createdat})
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
        skillstest
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
  const { id, skill_name } = EditSkillSchema.parse(
    Object.fromEntries(formData)
  );

  const updatedat = new Date();

  try {
    const result = await sql`
      UPDATE
        skillstest
      SET
        skill_name = ${skill_name},
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

// delete skill by id
export async function deleteSkill(id: string) {
  try {
    await sql`
      DELETE FROM
        skillstest
      WHERE
        id = ${id}
    `;

    return { message: "Skill deleted successfully", status: true };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { message: "Error deleting skill" };
  }
}
