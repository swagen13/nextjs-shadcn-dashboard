"use server";
import postgres from "postgres";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// // get children skills
export async function getSkills() {
  try {
    const result = await sql`
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
      s.sequence, -- Make sure to prefix the sequence column with table alias
      sh.level + 1 AS level
    FROM
      skillstest s
    INNER JOIN SkillHierarchy sh ON s.parent_id::INTEGER = sh.id
  )
  SELECT
    id,
    skill_name,
    parent_id,
    sequence,
    level
  FROM
    SkillHierarchy
  ORDER BY
    sequence ASC;
`;
    const skillHierarchy = buildSkillHierarchy(result);

    return skillHierarchy;
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

export async function saveSkillsOrder(skills: any[]) {
  try {
    const queries = skills.map((skill) => {
      return `
          UPDATE skillstest
          SET sequence = ${skill.sequence}
          WHERE id = ${skill.id};
        `;
    });

    await sql.begin(async (sql) => {
      for (const query of queries) {
        await sql.unsafe(query);
      }
    });
  } catch (error) {
    console.error("Error saving skills order:", error);
    throw error;
  }
}

export async function updateSkillList(skills: any[]) {
  const updatedat = new Date().toISOString(); // ใช้รูปแบบ ISO สำหรับวันที่และเวลา

  try {
    const ids = skills.map((skill) => skill.id).join(", ");

    const parentCases = skills
      .map(
        (skill) => `
          WHEN ${skill.id} THEN ${
          skill.parentId !== null ? `'${skill.parentId}'` : "NULL"
        }
        `
      )
      .join(" ");

    const sequenceCases = skills
      .map(
        (skill) => `
          WHEN ${skill.id} THEN ${
          skill.sequence !== undefined ? `'${skill.sequence}'` : "NULL"
        }
        `
      )
      .join(" ");

    const updatedCases = skills
      .map(
        (skill) => `
          WHEN ${skill.id} THEN '${updatedat}'
        `
      )
      .join(" ");

    const query = `
      UPDATE skillstest
      SET
        parent_id = CASE id ${parentCases} ELSE parent_id END,
        sequence = CASE id ${sequenceCases} ELSE sequence END,
        updatedat = CASE id ${updatedCases} ELSE updatedat END
      WHERE id IN (${ids});
    `;

    await sql.unsafe(query);

    return {
      message: "Skill list updated successfully",
      status: true,
    };
  } catch (error) {
    console.error("Error updating skills list:", error);
    return { message: "Skill list updated error", status: false };
  }
}
