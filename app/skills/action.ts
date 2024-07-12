"use server";
import { z } from "zod";
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

// Function to build the skill hierarchy
function buildSkillHierarchy(skills: any[]) {
  const skillMap = new Map();
  const roots: any[] = [];

  // Create a map of skills by their ID and initialize children arrays
  skills.forEach((skill) => {
    skillMap.set(skill.id, { ...skill, children: [] });
  });

  // Iterate over the skills and populate the hierarchy
  skillMap.forEach((skill) => {
    if (skill.parent_id === null) {
      roots.push(skill);
    } else {
      const parent = skillMap.get(parseInt(skill.parent_id));
      if (parent) {
        parent.children.push(skill);
      }
    }
  });

  return roots;
}

// Function to generate sequence strings
function generateSequences(skills: any[], parentSequence: string = "") {
  skills.forEach((skill, index) => {
    const currentSequence = parentSequence
      ? `${parentSequence}.${index + 1}`
      : `${index + 1}`;
    skill.sequence = currentSequence;

    // Recursively generate sequences for children
    if (skill.children && skill.children.length > 0) {
      generateSequences(skill.children, currentSequence);
    }
  });
}

// addSkill a new skill
export async function addSkill(formData: FormData) {
  const { skill_name } = SkillSchema.parse(Object.fromEntries(formData));

  const skill = {
    skill_name,
    createdat: new Date(),
  };

  try {
    await sql`
      INSERT INTO
        skillstest
        (skill_name, createdat,updatedat)
      VALUES
        (${skill.skill_name}, ${skill.createdat},${skill.createdat})
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
