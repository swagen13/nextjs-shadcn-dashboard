"use server";

// postgres connection
import postgres from "postgres";
import {
  JobPost,
  JobPostEditSubmission,
  JobPostSchema,
  JobPostSubmission,
} from "./schema";
let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

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

export async function addJobPost(jobPost: JobPostSubmission) {
  try {
    // Validate the jobPost object using the schema
    JobPostSchema.parse(jobPost);

    const { job_title, wage, post_owner, show, descriptions } = jobPost;
    const currentTime = new Date().toISOString(); // Get the current time in ISO format

    // Start a transaction
    await sql.begin(async (sql) => {
      // Insert into JobPosts table and get the inserted job post id
      const result = await sql`
        INSERT INTO jobposts (job_title, wage, post_owner, show, created_at, updated_at)
        VALUES (${job_title}, ${wage}, ${post_owner}, ${show}, ${currentTime}, ${currentTime})
        RETURNING id;
      `;
      const jobPostId = result[0].id;

      // Insert into JobPostDescription table
      for (const desc of descriptions) {
        await sql`
          INSERT INTO JobPostDescription (description, jobpost_id,created_at, updated_at)
          VALUES (${desc.description}, ${jobPostId},${currentTime},${currentTime});
        `;
      }
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
    const result = await sql`SELECT
          jp.id,
          jp.job_title,
          jp.wage,
          jp.post_owner,
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
      WHERE
          jp.id = ${jobPostId}
          GROUP BY
          jp.id
          ;`;
    return result;
  } catch (error) {
    console.error("Error updating visibility:", error);
    return null;
  }
}

export async function editJobPost(jobPost: JobPostEditSubmission) {
  try {
    // Validate the jobPost object using the schema
    JobPostSchema.parse(jobPost);

    const { id, job_title, wage, post_owner, show, descriptions } = jobPost;
    const currentTime = new Date().toISOString(); // Get the current time in ISO format

    // Start a transaction
    await sql.begin(async (sql) => {
      // Update JobPosts table
      await sql`
    UPDATE jobposts
    SET
      job_title = ${job_title},
      wage = ${wage},
      post_owner = ${post_owner},
      show = ${show},
      updated_at = ${currentTime}
    WHERE id = ${id}
  `;

      // Delete existing JobPostDescription records
      await sql`
    DELETE FROM JobPostDescription
    WHERE jobpost_id = ${id}
  `;

      // Prepare values for batch insert
      const descriptionValues = descriptions
        .map(
          (desc) =>
            `('${desc.description.replace(
              /'/g,
              "''"
            )}', ${id}, '${currentTime}', '${currentTime}')`
        )
        .join(", ");

      // Insert new JobPostDescription records
      await sql.unsafe(`
    INSERT INTO JobPostDescription (description, jobpost_id, created_at, updated_at)
    VALUES ${descriptionValues}
  `);
    });

    return {
      message: "Job post edited successfully",
      status: true,
    };
  } catch (error) {
    console.error("Error editing job post:", error);
    return {
      message: "Error editing job post",
      status: false,
    };
  }
}

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
