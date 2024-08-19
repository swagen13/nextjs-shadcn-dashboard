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
            name,
            parent_id,
            sequence,
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
    console.log("result", result);

    const skillHierarchy = buildSkillHierarchy(result);
    console.log("skillHierarchy", skillHierarchy);

    return skillHierarchy;
  } catch (error) {
    console.error("Error fetching skillssss:", error);
    return [];
  }
}

// Function to build the skill hierarchy
function buildSkillHierarchy(skills: any[]) {
  const skillMap = new Map();
  const roots: any[] = [];

  // Create a map of skills by their ID and initialize children arrays and translations
  skills.forEach((skill) => {
    if (!skillMap.has(skill.id)) {
      skillMap.set(skill.id, {
        id: skill.id,
        name: skill.name,
        parent_id: skill.parent_id,
        sequence: skill.sequence,
        level: skill.level,
        translations: [],
        children: [],
      });
    }

    // If there are translations, add them to the translations array
    if (skill.locale) {
      skillMap.get(skill.id).translations.push({
        locale: skill.locale,
        name: skill.translation_name,
      });
    }
  });

  // Iterate over the skills and populate the hierarchy
  skillMap.forEach((skill) => {
    if (skill.parent_id === null || skill.parent_id === "") {
      roots.push(skill);
    } else {
      const parent = skillMap.get(skill.parent_id);
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
          UPDATE skills
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
  const updated_at = new Date().toISOString(); // ใช้รูปแบบ ISO สำหรับวันที่และเวลา

  try {
    const ids = skills.map((skill) => `'${skill.id}'`).join(", ");

    const parentCases = skills
      .map(
        (skill) => `
          WHEN '${skill.id}' THEN ${
          skill.parentId !== null ? `'${skill.parentId}'` : "NULL"
        }
        `
      )
      .join(" ");

    const sequenceCases = skills
      .map(
        (skill) => `
          WHEN '${skill.id}' THEN ${
          skill.sequence !== undefined ? `'${skill.sequence}'` : "NULL"
        }
        `
      )
      .join(" ");

    const updatedCases = skills
      .map(
        (skill) => `
          WHEN '${skill.id}' THEN '${updated_at}'
        `
      )
      .join(" ");

    console.log("parentCases", parentCases);
    console.log("sequenceCases", sequenceCases);
    console.log("updatedCases", updatedCases);

    const query = `
      UPDATE skills
      SET
        parent_id = CASE id ${parentCases} ELSE parent_id END,
        sequence = CASE id ${sequenceCases} ELSE sequence END,
        updated_at = CASE id ${updatedCases} ELSE updated_at END
      WHERE id IN (${ids});
    `;

    console.log("query", query);

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
