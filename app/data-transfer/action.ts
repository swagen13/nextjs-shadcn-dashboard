"use server";
import postgres from "postgres";
import { initAdmin } from "@/firebaseAdmin";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function transferDataToPostgres(skills: any) {
  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS childrenSkills (
        id TEXT PRIMARY KEY,
        createdAt TEXT,
        sequence INT,
        color TEXT,
        icon TEXT,
        name TEXT,
        description TEXT,
        subSkillId TEXT,
        slug TEXT,
        updatedAt TEXT,
        translationsName TEXT,
        translationsLocale TEXT
      )
    `;

    for (const skill of skills) {
      // Destructure and replace undefined values with null
      const {
        id,
        createdAt = null,
        sequence = null,
        color = null,
        icon = null,
        name = null,
        description = null,
        subSkillId = null,
        slug = null,
        updatedAt = null,
        translations,
      } = skill;

      const translationsName = translations?.[0]?.name || null;
      const translationsLocale = translations?.[0]?.locale || null;

      // Insert data
      await sql`
        INSERT INTO childrenSkills (
          id,
          createdAt,
          sequence,
          color,
          icon,
          name,
          description,
          subSkillId,
          slug,
          updatedAt,
          translationsName,
          translationsLocale
        )
        VALUES (
          ${id},
          ${createdAt},
          ${sequence},
          ${color},
          ${icon},
          ${name},
          ${description},
          ${subSkillId},
          ${slug},
          ${updatedAt},
          ${translationsName},
          ${translationsLocale}
        )
      `;
    }

    // Get data
    const getSkills = await sql`SELECT * FROM childrenSkills`;

    return getSkills;
  } catch (error) {
    console.error("Error transferring data:", error);
    return [];
  }
}

// get all children skills from firebase
export async function getChildrenSkills() {
  try {
    const admin = await initAdmin();
    const db = admin.firestore();
    const snapshot = await db.collection("subSkills").get();
    const skills = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return skills;
  } catch (error) {
    console.error("Error fetching children skills:", error);
    return [];
  }
}
