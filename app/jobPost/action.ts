"use server";

// postgres connection
import postgres from "postgres";
import { EditJobPostSchema, JobPostSchema } from "./schema";
import { SkillData } from "../skills/schema";
let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function editJobPost(
  prevState: { message: string },
  formData: FormData
) {
  try {
    const { id, job_title, wage, post_owner, show, description, skill_id } =
      EditJobPostSchema.parse(Object.fromEntries(formData));

    console.log("id:", id);
    console.log("show:", show);
    console.log("description:", description);
    console.log("typeof description:", typeof description);
    console.log("job_title:", job_title);
    console.log("wage:", wage);
    console.log("post_owner:", post_owner);
    console.log("skill_id:", skill_id);
    return {
      message: "Please implement the editJobPost function",
      status: true,
    };

    // Perform update operations here
  } catch (error) {
    console.error("Error editing job post:", error);
    return { message: "Error editing job post", status: false };
  }
}

export async function getJobPost(page: number, limit: number, name?: string) {
  if (!page) page = 1;
  if (!limit) limit = 10;

  try {
    const offset = (page - 1) * limit; // Calculate OFFSET
    let query;

    if (name && name.trim() !== "") {
      query = sql`
       SELECT
          jp.id,
          jp.job_title,
          jp.wage,
          jp.post_owner,
          jp.skill_id,
          jp.show,
          jp.description,
          jp.created_at,
          jp.updated_at,
          json_agg(
              json_build_object(
                  'id', jd.id,
                  'description', jd.description,
                  'created_at', jd.created_at,
                  'updated_at', jd.updated_at
              )
          ) AS descriptions
      FROM
          JobPosts jp      
      LEFT JOIN
          JobPostDescription jd
      ON
          jp.id = jd.jobpost_id
      WHERE
          jp.job_title LIKE ${"%" + name + "%"}
      GROUP BY
          jp.id
      LIMIT ${limit + 1}
      OFFSET ${offset};
    `;
    } else {
      query = sql`
      SELECT
          jp.id,
          jp.job_title,
          jp.wage,
          jp.post_owner,
          jp.skill_id,
          jp.show,
          jp.created_at,
          jp.updated_at,
          json_agg(
              json_build_object(
                  'id', jd.id,
                  'description', jd.description,
                  'created_at', jd.created_at,
                  'updated_at', jd.updated_at
              )
          ) AS descriptions
      FROM
          JobPosts jp
      LEFT JOIN
          JobPostDescription jd
      ON
          jp.id = jd.jobpost_id
      GROUP BY
          jp.id
      LIMIT ${limit + 1}
      OFFSET ${offset};
    `;
    }

    const result = await query;

    return result;
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return [];
  }
}

export async function getUsers() {
  try {
    const result = await sql`
          SELECT
            *
          FROM
            users         
        `;
    return result;
  } catch (error) {
    return [];
  }
}

export async function addJobPost(jobPost: any) {
  try {
    // Validate the jobPost object using the schema
    JobPostSchema.parse(jobPost);

    const { job_title, wage, post_owner, show, description, skill_id } =
      jobPost;
    const currentTime = new Date().toISOString(); // Get the current time in ISO format

    console.log("jobPost", jobPost);

    // Start a transaction
    await sql.begin(async (sql) => {
      // Insert into JobPosts table and get the inserted job post id
      const result = await sql`
        INSERT INTO jobposts (job_title, wage, post_owner, skill_id, show, description, created_at, updated_at)
        VALUES (${job_title}, ${wage}, ${post_owner}, ${skill_id}, ${show}, ${description}, ${currentTime}, ${currentTime})
        RETURNING id;
      `;
      const jobPostId = result[0].id;
    });

    return {
      message: "Job post added successfully",
      status: true,
    };
  } catch (error) {
    console.error("Error adding job post:", error);
    return {
      message: "Error adding job post",
      status: false,
    };
  }
}

export async function handlerShowJobPost(jobPostId: number, show: boolean) {
  try {
    const result = await sql`
      UPDATE jobposts
      SET show = ${show}
      WHERE id = ${jobPostId};
    `;

    return {
      message: "Job post added successfully",
      status: true,
    };
  } catch (error) {
    console.error("Error updating visibility:", error);
    return {
      message: "Error adding job post",
      status: false,
    };
  }
}

export async function getJobPostById(jobPostId: number) {
  try {
    const result = await sql`
          SELECT
          id,
          job_title,
          wage,
          post_owner,
          skill_id,
          show,
          description,
          created_at,
          updated_at
          FROM
          JobPosts
      WHERE
          id = ${jobPostId}
      GROUP BY
          id;`;
    return result;
  } catch (error) {
    console.error("Error updating visibility:", error);
    return null;
  }
}

// export async function editJobPost(jobPost: FormData) {
//   try {
//     const { id, job_title, wage, post_owner, show, description, skill_id } =
//       EditJobPostSchema.parse(Object.fromEntries(jobPost));

//     // const currentTime = new Date().toISOString(); // Get the current time in ISO format
//     console.log("id:", id);
//     console.log("show:", show);
//     console.log("description:", description);

//     // await sql.begin(async (sql) => {
//     //   // Update JobPosts table
//     //   const result = await sql`
//     //   UPDATE jobposts
//     //   SET
//     //     job_title = ${job_title},
//     //     wage = ${wage},
//     //     post_owner = ${post_owner},
//     //     skill_id = ${skill_id},
//     //     show = ${show},
//     //     description = ${description},
//     //     updated_at = ${currentTime}
//     //   WHERE id = ${id}
//     // `;

//     //   console.log(result);
//     // });

//     return {
//       message: "Job post edited successfully",
//       status: true,
//     };
//   } catch (error) {
//     console.error("Error editing job post:", error);
//     return {
//       message: "Error editing job post",
//       status: false,
//     };
//   }
// }

export async function deletePostJob(postId: number) {
  try {
    await sql.begin(async (sql) => {
      // Delete from JobPostDescription first
      await sql`
        DELETE FROM JobPostDescription
        WHERE jobpost_id = ${postId}
      `;

      // Delete from jobposts
      await sql`
        DELETE FROM jobposts
        WHERE id = ${postId}
      `;
    });

    return {
      message: "Job post deleted successfully",
      status: true,
    };
  } catch (error) {
    console.error("Error deleting job post:", error);
    return {
      message: "Error deleting job post",
      status: false,
    };
  }
}

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
    console.log("skillData", skillData);

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
