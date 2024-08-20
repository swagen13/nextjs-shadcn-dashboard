"use server";
import { put } from "@vercel/blob";
import { EditSkillSchema, SkillData, SkillSchema } from "./schema";

// postgres connection
import postgres from "postgres";
let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function getSkills(page: number, limit: number, name?: string) {
  if (!page) page = 1;
  if (!limit) limit = 10;

  const offset = (page - 1) * limit;

  try {
    let query;
    if (name && name.trim() !== "") {
      query = sql`
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
        WHERE
          sh.name ILIKE ${"%" + name + "%"}
        ORDER BY
          sh.sequence ASC
        LIMIT ${limit + 1}
        OFFSET ${offset};
      `;
    } else {
      query = sql`
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
          sh.sequence ASC
        LIMIT ${limit + 1}
        OFFSET ${offset};
      `;
    }

    const result = await query;
    console.log("result", result);

    return result;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function addSkill(prevState: any, formData: FormData) {
  // Convert FormData to Object
  const formDataObj = Object.fromEntries(formData.entries());

  console.log("formDataObj", formDataObj);

  // Extract the File object for the image
  const skillImageFile = formData.get("skill_image") as File;

  // Extract the File object for the icon
  const iconFile = formData.get("icon") as File;

  // Convert necessary fields
  const parsedData = {
    sequence: formDataObj.sequence
      ? parseFloat(formDataObj.sequence as string)
      : null,
  };

  // Extract translations
  const translations: any[] = [];
  for (const key in formDataObj) {
    if (key.startsWith("translations.")) {
      const match = key.match(/translations\.(\d+)\.(\w+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        translations[index] = translations[index] || {};
        translations[index][field] = formDataObj[key];
      }
    }
  }

  // Determine new sequence if parent_id is not provided or is empty
  if (!formDataObj.parent_id || formDataObj.parent_id === "") {
    // Fetch existing sequences for top-level skills
    const existingSequences = await fetchExistingSequences(); // Implement this function

    // Find the highest existing sequence and determine the new one
    const highestSequence = existingSequences
      .filter((seq) => !isNaN(seq))
      .sort((a, b) => b - a)[0];

    parsedData.sequence = highestSequence ? highestSequence + 1 : 1;
  }

  // Explicitly type the data object
  const data: SkillData = {
    id: null,
    name: formDataObj.name as string,
    color: formDataObj.color as string | null,
    description: formDataObj.description as string | null,
    icon: formDataObj.icon as string | null,
    parent_id: formDataObj.parent_id as string | null,
    sequence: formDataObj.sequence?.toString() || "",
    slug: formDataObj.slug as string,
    translations,
    skill_image: formDataObj.skill_image as string | null,
  };

  console.log("data", data);

  try {
    // Step 1: Insert skill data into the database
    const skillIdResult = await sql`
      INSERT INTO skills (
        name,
        color,
        description,
        icon,
        parent_id,
        sequence,
        slug,
        created_at,
        updated_at
      ) VALUES (
        ${data.name},
        ${data.color},
        ${data.description},
        ${data.icon},
        ${data.parent_id},
        ${data.sequence},
        ${data.slug},
        ${new Date().toISOString()},
        ${new Date().toISOString()}
      )
      RETURNING id;
    `;
    const skillId = skillIdResult[0].id;

    // Update skill ID in the data object
    data.id = skillId;

    // Step 2: Prepare translations for insertion
    const translationInserts = translations.map((t) => [
      skillId,
      t.locale,
      t.name,
    ]);

    // Create a list of upload promises
    const uploadPromises = [];

    // Step 3: If skill_image is provided, prepare for upload
    if (skillImageFile && skillImageFile instanceof File) {
      // Create a folder for the image based on skill ID
      const imageFolder = `${skillId}`;
      uploadPromises.push(
        uploadImage(skillImageFile, imageFolder).then((imageUrl) => {
          if (imageUrl) {
            // Update the skill with the image URL
            return sql`
            UPDATE skills
            SET skill_image = ${imageUrl}
            WHERE id = ${skillId};
          `.then(() => {
              // Update the data object with the image URL
              data.skill_image = imageUrl;
            });
          }
        })
      );
    }

    // Step 4: If icon is provided, prepare for upload
    if (iconFile && iconFile instanceof File) {
      // Create a folder for the icon based on skill ID
      const iconFolder = `${skillId}/icons`;
      uploadPromises.push(
        uploadImage(iconFile, iconFolder).then((iconUrl) => {
          if (iconUrl) {
            // Update the skill with the icon URL
            return sql`
            UPDATE skills
            SET icon = ${iconUrl}
            WHERE id = ${skillId};
          `.then(() => {
              // Update the data object with the icon URL
              data.icon = iconUrl;
            });
          }
        })
      );
    }

    // Step 5: Insert translations into the database
    const translationPromise = sql`
      INSERT INTO skill_translations (skill_id, locale, name)
      VALUES ${sql(translationInserts)};
    `;

    // Wait for all promises to complete
    await Promise.all([translationPromise, ...uploadPromises]);

    return { message: "Skill created successfully", status: true };
  } catch (error) {
    console.error("Error creating skill:", error);
    return { message: "Error creating skill", status: false };
  }
}

// Example function to fetch existing sequences
async function fetchExistingSequences(): Promise<number[]> {
  try {
    // Implement your data fetching logic here
    // For example, a query to get all top-level skills' sequences
    const result = await sql`
      SELECT sequence
      FROM skills
      WHERE parent_id IS NULL OR parent_id = '';
    `;

    // Process result to extract sequences
    return result.map((row: any) => parseFloat(row.sequence) || 0);
  } catch (error) {
    console.error("Error fetching existing sequences:", error);
    return [];
  }
}

// get skill by id
export async function getSkillById(id: string) {
  try {
    const result = await sql`
      SELECT
        s.*,
        st.locale,
        st.name as translation_name
      FROM
        skills s
      LEFT JOIN
        skill_translations st
      ON
        s.id = st.skill_id
      WHERE
        s.id = ${id}
    `;

    if (result.length) {
      // Group translations under the skill
      const skillData: SkillData = {
        id: result[0].id,
        name: result[0].name,
        color: result[0].color,
        description: result[0].description,
        icon: result[0].icon,
        skill_image: result[0].skill_image,
        parent_id: result[0].parent_id,
        sequence: result[0].sequence,
        slug: result[0].slug,
        translations: result.map((row) => ({
          locale: row.locale,
          name: row.translation_name,
        })),
      };
      console.log("skillData", skillData);

      return skillData;
    } else {
      return { message: "Skill not found", status: false };
    }
  } catch (error) {
    console.error("Error fetching skill:", error);
    return { message: "Error fetching skill" };
  }
}

// update skill by id
export async function updateSkill(prevState: any, formData: FormData) {
  // Convert FormData to Object
  const formDataObj = Object.fromEntries(formData.entries());

  console.log("formDataObj", formDataObj);

  // Extract the File object for the image
  const skillImageFile = formData.get("skill_image") as File;

  // Extract the File object for the icon
  const iconFile = formData.get("icon") as File;

  // Convert necessary fields
  const parsedData = {
    sequence: formDataObj.sequence
      ? parseFloat(formDataObj.sequence as string)
      : null,
  };

  // Extract translations
  const translations: any[] = [];
  for (const key in formDataObj) {
    if (key.startsWith("translations.")) {
      const match = key.match(/translations\.(\d+)\.(\w+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        translations[index] = translations[index] || {};
        translations[index][field] = formDataObj[key];
      }
    }
  }

  // Explicitly type the data object
  const data: SkillData = {
    id: formDataObj.id as string,
    name: formDataObj.name as string,
    color: formDataObj.color as string | null,
    description: formDataObj.description as string | null,
    icon: formDataObj.icon as string | null,
    parent_id: formDataObj.parent_id as string | null,
    sequence: formDataObj.sequence?.toString() || "",
    slug: formDataObj.slug as string,
    translations,
    skill_image: formDataObj.skill_image as string | null,
  };

  console.log("data", data);

  try {
    // Step 1: Update skill data in the database
    await sql`
      UPDATE skills
      SET
        name = ${data.name},
        color = ${data.color},
        description = ${data.description},
        parent_id = ${data.parent_id},
        sequence = ${data.sequence},
        slug = ${data.slug},
        updated_at = ${new Date().toISOString()}
      WHERE id = ${data.id};
    `;

    // Step 2: Prepare translations for insertion
    const translationInserts = translations.map((t) => [
      data.id,
      t.locale,
      t.name,
    ]);

    // Create a list of upload promises
    const uploadPromises = [];

    // Step 3: If skill_image is provided, prepare for upload
    if (skillImageFile.size > 0 && skillImageFile instanceof File) {
      // Create a folder for the image based on skill ID
      const imageFolder = `${data.id}`;
      uploadPromises.push(
        uploadImage(skillImageFile, imageFolder).then((imageUrl) => {
          if (imageUrl) {
            // Update the skill with the image URL
            return sql`
            UPDATE skills
            SET skill_image = ${imageUrl}
            WHERE id = ${data.id};
          `.then(() => {
              // Update the data object with the image URL
              data.skill_image = imageUrl;
            });
          }
        })
      );
    }

    // Step 4: If icon is provided, prepare for upload
    if (iconFile.size > 0 && iconFile instanceof File) {
      // Create a folder for the icon based on skill ID
      const iconFolder = `${data.id}/icons`;
      uploadPromises.push(
        uploadImage(iconFile, iconFolder).then((iconUrl) => {
          if (iconUrl) {
            // Update the skill with the icon URL
            return sql`
            UPDATE skills
            SET icon = ${iconUrl}
            WHERE id = ${data.id};
          `.then(() => {
              // Update the data object with the icon URL
              data.icon = iconUrl;
            });
          }
        })
      );
    }

    // Step 5: Update translations in the database
    await sql`
      DELETE FROM skill_translations WHERE skill_id = ${data.id};
    `;

    const translationPromise = sql`
      INSERT INTO skill_translations (skill_id, locale, name)
      VALUES ${sql(translationInserts)};
    `;

    // Wait for all promises to complete
    await Promise.all([translationPromise, ...uploadPromises]);

    return { message: "Skill updated successfully", status: true };
  } catch (error) {
    console.error("Error updating skill:", error);
    return { message: "Error updating skill", status: false };
  }
}

// delete skill by id
export async function deleteSkill(id: string) {
  try {
    // Start a transaction
    await sql.begin(async (transaction) => {
      // Delete from the skill_translations table
      await transaction`
        DELETE FROM skill_translations
        WHERE skill_id = ${id}
      `;

      // Delete from the skills table
      await transaction`
        DELETE FROM skills
        WHERE id = ${id}
      `;
    });

    return { message: "Skill deleted successfully", status: true };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { message: "Error deleting skill", status: false };
  }
}
// select * from skills
export async function getAllSkills() {
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

    // Use this function when processing data
    const skillData: SkillData[] = transformToSkillData(result);

    return skillData;
  } catch (error) {
    console.error("Error fetching skillssss:", error);
    return [];
  }
}

function transformToSkillData(rawData: any[]): SkillData[] {
  return rawData.map((item) => ({
    id: item.id || null,
    name: item.name || "",
    color: item.color || null,
    description: item.description || null,
    icon: item.icon || null,
    parent_id: item.parent_id || null,
    sequence: item.sequence || null,
    slug: item.slug || "",
    translations: item.translations || [],
    level: item.level || 0, // Default or calculate if needed
  }));
}

// upload image to vercel blob
export async function uploadImage(file: File, folder: string) {
  try {
    // Upload the image buffer to the server
    const imageBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Upload the image to Vercel Blob
    const response = await put(`skill-image/${folder}/${file.name}`, buffer, {
      access: "public",
      token: "vercel_blob_rw_d0shhpZLmtvsciZy_E4yCTlGweo2ZfNrkiAoYbk7D2tYe12",
      contentType: file.type,
    });

    if (response.url) {
      return response.url;
    }
  } catch (error) {
    console.error("Image upload failed:", error);
  }
}
