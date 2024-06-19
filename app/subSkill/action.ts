"use server";
import postgres from "postgres";
import { EditSubSkillSchema, SubSkillSchema } from "./schema";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// get data from subskills table
export async function getSubSkills(
  parentId: string,
  page: number,
  name: string
) {
  if (!page) page = 1;

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    if (!parentId || parentId === "all") {
      if (!name) {
        const result = await sql`
          SELECT
            *
          FROM
            subskills
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
            subskills
          WHERE
            name ILIKE ${"%" + name + "%"}
          LIMIT
            ${limit}
          OFFSET
            ${offset}
        `;
        return result;
      }
    } else {
      if (!name) {
        const result = await sql`
          SELECT
            *
          FROM
            subskills
          WHERE
            parentId = ${parentId}
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
            subskills
          WHERE
            parentId = ${parentId}
          AND
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

// get subskills by id
export async function getSubSkillById(id: string) {
  try {
    const result = await sql`
      SELECT
        *
      FROM
        subskills
      WHERE
        id = ${id}
    `;
    return result[0];
  } catch (error) {
    console.error("Error fetching subskill by id:", error);
    return null;
  }
}

// get data from skills table
export async function getSkillsWithChildrenCount() {
  try {
    const result = await sql`
      SELECT
        s.id AS id,
        s.parentId,
        s.name,
        COUNT(ss.parentId) as children_count
      FROM
        skills s
      LEFT JOIN
        subskills ss ON s.parentId = ss.parentId
      GROUP BY
        s.id
    `;

    return result;
  } catch (error) {
    console.error("Error fetching skills with children count:", error);
    return [];
  }
}

// delete subskills
export async function deleteSubSkill(id: string) {
  try {
    const result = await sql`
      DELETE FROM
        subskills
      WHERE
        id = ${id}
    `;

    // Check the result for affected rows
    if (result.count > 0) {
      return { message: "Skill deleted successfully" };
    } else {
      return { message: "Skill not found" };
    }
  } catch (error) {
    console.error("Error deleting subskill:", error);
    return { message: "Error deleting subskill" };
  }
}

// update subskills
export async function updateSubSkill(formData: FormData) {
  const { id, name, description, translationsname, parentid } =
    EditSubSkillSchema.parse(Object.fromEntries(formData));
  try {
    const result = await sql`
      UPDATE
        subskills
      SET
        name = ${name},
        description = ${description},
        translationsname = ${translationsname},
        parentid = ${parentid}
      WHERE
        id = ${id}
    `;
    // Check the result for affected rows
    if (result.count > 0) {
      return { message: "Skill updated successfully", status: true };
    } else {
      return { message: "Skill not found", status: false };
    }
  } catch (error) {
    console.error("Error updating subskill:", error);
    return { message: "Error updating subskill" };
  }
}

// add subskills to subskills table
export async function addSkill(formData: FormData) {
  const { name, description, translationsname, parentid } =
    SubSkillSchema.parse(Object.fromEntries(formData));
  const id = Math.floor(Math.random() * 1000000);
  try {
    const result = await sql`
      INSERT INTO
        subskills
        (id,name, description, translationsname, parentid)
      VALUES
  (${id},${name}, ${description}, ${translationsname}, ${parentid})
    `;
    return { message: "Skill added successfully", status: true };
  } catch (error) {
    console.error("Error adding skill:", error);
    return { message: "Error adding skill", status: false };
  }
}

// get parent skills
export async function getSkillParents() {
  try {
    const result = await sql`
      SELECT
        *
      FROM
        skills
    `;
    return result;
  } catch (error) {
    console.error("Error fetching parent skills:", error);
    return [];
  }
}

// get all subskills
export async function getAllSubSkills() {
  try {
    const result = await sql`
      SELECT
        *
      FROM
        subskills
    `;

    return result;
  } catch (error) {
    console.error("Error fetching subskills:", error);
    return [];
  }
}
