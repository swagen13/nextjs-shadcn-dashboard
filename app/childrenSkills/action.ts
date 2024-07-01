"use server";
import postgres from "postgres";
import { ChidrentSkillSchema } from "./schema";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// // get children skills
// Function to get skills with recursive SQL query and build the hierarchy
export async function getSkills() {
  try {
    const result = await sql`
      WITH RECURSIVE SkillHierarchy AS (
        SELECT
          id,
          skill_name,
          parent_id,
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
          sh.level + 1 AS level
        FROM
          skillstest s
        INNER JOIN SkillHierarchy sh ON s.parent_id::INTEGER = sh.id
      )
      SELECT
        id,
        skill_name,
        parent_id,
        level
      FROM
        SkillHierarchy
      ORDER BY
        level;
    `;
    const sortSkill = buildSkillHierarchy(result);
    console.log("sortSkill", result);
    return sortSkill;
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

// add child skills
export async function addChildSkill(formData: FormData) {
  const { skill_name, parent_id } = ChidrentSkillSchema.parse(
    Object.fromEntries(formData)
  );

  try {
    // Insert the new skill into the database
    await sql`
      INSERT INTO
        skillstest
        (skill_name, parent_id)
      VALUES
        (${skill_name}, ${parent_id})
    `;

    // Fetch the last inserted skill along with its path using a recursive query
    const lastInserted = await sql`
      WITH RECURSIVE SkillHierarchy AS (
        SELECT
          id,
          skill_name,
          parent_id,
          0 AS level,
          ARRAY[]::INTEGER[] AS path
        FROM
          skillstest
        WHERE
          parent_id IS NULL
        UNION ALL
        SELECT
          s.id,
          s.skill_name,
          s.parent_id,
          sh.level + 1 AS level,
          path || sh.id
        FROM
          skillstest s
        INNER JOIN SkillHierarchy sh ON s.parent_id::INTEGER = sh.id
      )
      SELECT
        id,
        skill_name,
        parent_id,
        level,
        path
      FROM
        SkillHierarchy
      WHERE
        id = (SELECT MAX(id) FROM skillstest);
    `;

    if (lastInserted.length === 0) {
      throw new Error("No skill found or inserted");
    }

    // Extract path to root skill
    const pathToRoot = lastInserted[0].path.reverse(); // Reverse to get root to leaf order

    // remove path from the result
    delete lastInserted[0].path;

    return {
      message: "Skill added successfully",
      status: true,
      skill: lastInserted[0],
      path: pathToRoot,
    };
  } catch (error) {
    console.log("Error adding skill:", error);
    return { message: "Error adding skill", status: false };
  }
}

// getChildrenSkills
export async function getChildrenSkills() {
  try {
    const result = await sql`
      SELECT
        *
      FROM
        skillstest      
    `;
    return result;
  } catch (error) {
    console.error("Error fetching children skills:", error);
    return [];
  }
}

// export function calculateSkillLevels(skills: any[]) {
//   const skillHierarchy = buildSkillHierarchy(skills);

//   function traverseAndSetLevels(
//     skill: { level: any; children: any[] },
//     level: number
//   ) {
//     skill.level = level;
//     skill.children.forEach((child) => {
//       traverseAndSetLevels(child, level + 1);
//     });
//   }

//   skillHierarchy.forEach((root) => {
//     traverseAndSetLevels(root, 1); // Starting level is 1 for root skills
//   });

//   return skills.map((skill) => {
//     return {
//       id: skill.id,
//       skill_name: skill.skill_name,
//       parent_id: skill.parent_id,
//       level: skill.level || 0, // Default level to 0 if not set
//     };
//   });
// }

// // get subskill by skill id
// export async function getSubSkillByParent(skillId: string) {
//   try {
//     const result = await sql`
//       SELECT
//         *
//       FROM
//         subskills
//       WHERE
//         parentId = ${skillId}
//     `;
//     return result;
//   } catch (error) {
//     console.error("Error fetching subskills:", error);
//     return [];
//   }
// }

// // get subskill and count children
// export async function getSubSkillsWithChildrenCount(parentId: string) {
//   try {
//     const result = await sql`
//       SELECT
//         subskills.*,
//         COUNT(childrenskills.id) as children_count
//       FROM
//         subskills
//       LEFT JOIN
//         childrenskills
//       ON
//         subskills.id = childrenskills.subskillid
//       WHERE
//         subskills.parentid = ${parentId}
//       GROUP BY
//         subskills.id
//     `;
//     return result;
//   } catch (error) {
//     console.error("Error fetching subskills:", error);
//     return [];
//   }
// }

// // delete child skills
// export async function deleteChildSkill(id: string) {
//   try {
//     const result = await sql`
//       DELETE FROM
//         childrenskills
//       WHERE
//         id = ${id}
//     `;
//     return { message: "Skill deleted successfully", status: true };
//   } catch (error) {
//     return { message: "Error deleting skill", status: false };
//   }
// }

// // add child skills
// export async function addChildSkill(formData: FormData) {
//   const { name, description, translationsname, subskillid } =
//     ChidrentSkillSchema.parse(Object.fromEntries(formData));
//   try {
//     const result = await sql`
//       INSERT INTO
//         childrenskills
//         (name, description, translationsname, subskillid)
//       VALUES
//         (${name}, ${description}, ${translationsname}, ${subskillid})
//     `;
//     return { message: "Skill added successfully", status: true };
//   } catch (error) {
//     return { message: "Error adding skill", status: false };
//   }
// }
// // get chidrent skills by subskillid
// export async function getChildrenSkillsBySubSkillId(subSkillId: string) {
//   try {
//     const result = await sql`
//       SELECT
//         id,
//         name,
//         subskillid
//       FROM
//         childrenskills
//       WHERE
//         subskillid = ${subSkillId}
//     `;
//     console.log("result", result);

//     return result;
//   } catch (error) {
//     console.error("Error fetching children skills:", error);
//     return [];
//   }
// }

// // get all subskills
// export async function getAllSubSkills() {
//   try {
//     const result = await sql`
//       SELECT
//         id,
//         name
//       FROM
//         subskills
//     `;
//     console.log("subskills", result);

//     return result;
//   } catch (error) {
//     console.error("Error fetching subskills:", error);
//     return [];
//   }
// }
