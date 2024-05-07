"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import postgres, { PostgresError } from "postgres";
import { z } from "zod";
import { UserData } from "../data/schema";
import { File } from "formdata-node";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export async function createUser(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    username: z.string(),
    email: z.string({
      invalid_type_error: "Invalid Email",
    }),
    password: z.string(),
    image: z.instanceof(File).optional(),
    imageResize: z.instanceof(File).optional(),
  });

  const { username, email, password, image, imageResize } = schema.parse(
    Object.fromEntries(formData)
  );

  try {
    // Execute the INSERT query to create a new user
    const result = await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${password} )
      RETURNING *
    `;

    let imagePath = null;

    // Check if an image is provided
    if (image) {
      // Read the image buffer from FormData
      const imageBuffer = await image.arrayBuffer();

      console.log("imageBuffer:", imageBuffer);

      // Compress the image
      const compressedImageBuffer = await compressImage(imageBuffer);

      console.log("compressedImageBuffer:", compressedImageBuffer);

      // Upload the compressed image to the server
      const imagePath = await put(
        `images/${image.name}`,
        compressedImageBuffer,
        {
          access: "public",
          token:
            "vercel_blob_rw_d0shhpZLmtvsciZy_E4yCTlGweo2ZfNrkiAoYbk7D2tYe12",
          contentType: image.type,
        }
      );

      // Revalidate the cache
      revalidatePath("/");

      // Upload the image URL to the database
      await sql`
        UPDATE users
        SET image = ${imagePath ? imagePath.url : null}
        WHERE id = ${result[0].id}
      `;
    }

    // Return the result as JSON
    return { message: "User created successfully", status: true };
  } catch (error) {
    const errors = error as PostgresError;

    console.error("Error creating user:", error);

    // Return an error response
    return { message: errors.message, status: false };
  }
}

// get all user information
export async function getUsers() {
  try {
    const users = await sql`SELECT * FROM users`;

    // parse the user data into the UserData schema
    return users.map((user: any) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        image: user.image,
      };
    });
  } catch (error) {
    console.error("Error getting users:", error);

    return [];
  }
}

// update user information
export async function updateUser(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
    image: z.instanceof(File).optional(),
  });

  const { id, username, email, password, image } = schema.parse(
    Object.fromEntries(formData)
  );

  try {
    // Execute the UPDATE query to update the user
    const result = await sql`
            UPDATE users
            SET username = ${username}, email = ${email}, password = ${password}
            WHERE id = ${id}
            RETURNING *
          `;

    let imagePath = null;

    // Check if an image is provided
    if (image) {
      // Read the image buffer from FormData
      const imageBuffer = await image.arrayBuffer();

      console.log("imageBuffer:", imageBuffer);

      // Compress the image
      const compressedImageBuffer = await compressImage(imageBuffer);

      console.log("compressedImageBuffer:", compressedImageBuffer);

      // Upload the compressed image to the server
      const imagePath = await put(
        `images/${image.name}`,
        compressedImageBuffer,
        {
          access: "public",
          token:
            "vercel_blob_rw_d0shhpZLmtvsciZy_E4yCTlGweo2ZfNrkiAoYbk7D2tYe12",
          contentType: image.type,
        }
      );
      // Revalidate the cache
      revalidatePath("/");

      // upload the image to the server
      await sql`
        UPDATE users
        SET image = ${imagePath ? imagePath.url : null}
        WHERE id = ${result[0].id}
      `;
    }

    // Return the result as JSON
    return { message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);

    // Return an error response
    return { message: "Error updating user" };
  }
}

// get user information by id
export async function getUserById(id: string) {
  try {
    const users: UserData[] = await sql`SELECT * FROM users WHERE id = ${id}`;

    // parse the user data into the UserData schema
    return users.map((user: UserData) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        image: user.image,
      };
    });
  } catch (error) {
    console.error("Error getting user by id:", error);
    return [];
  }
}

// delete user information
export async function deleteUser(id: string) {
  try {
    const result = await sql`
        DELETE FROM users WHERE id = ${id}
      `;

    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);

    return { message: "Error deleting user" };
  }
}

export async function UploadImage(
  prevState: { message: string },
  formData: FormData
) {
  try {
    const schema = z.object({
      image: z.instanceof(File).optional(),
    });

    const { image } = schema.parse(Object.fromEntries(formData));

    if (!image) {
      return { message: "No image provided", status: false };
    }

    // Read the image buffer from FormData
    const imageBuffer = await image.arrayBuffer();

    console.log("imageBuffer:", imageBuffer);

    // Compress the image
    const compressedImageBuffer = await compressImage(imageBuffer);

    console.log("compressedImageBuffer:", compressedImageBuffer);

    // Upload the compressed image to the server
    const blob = await put(`images/${image.name}`, compressedImageBuffer, {
      access: "public",
      token: "vercel_blob_rw_d0shhpZLmtvsciZy_E4yCTlGweo2ZfNrkiAoYbk7D2tYe12",
      contentType: image.type,
    });

    return {
      message: "Image uploaded and compressed successfully",
      status: true,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { message: "Error uploading image", status: false };
  }
}

async function compressImage(imageBuffer: ArrayBuffer): Promise<Buffer> {
  const sharp = require("sharp");

  // Compress 50% the image buffer
  const compressedImageBuffer = await sharp(imageBuffer)
    .resize(500, 500, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();

  return compressedImageBuffer;
}
// upload image data to server
// export async function uploadImage(
//   prevState: {
//     message: string;
//   },
//   formData: FormData
// ) {
//   const schema = z.object({
//     file: z.instanceof(File),
//   });

//   // upload image with blob
//   const { file } = schema.parse(Object.fromEntries(formData));

//   try {
//     console.log("Uploading image:", file.name);

//     // Save the image to the server
//     const blob = await put(file.name, file, {
//       access: "public",
//       token: process.env.BLOB_READ_WRITE_TOKEN, // Provide the token here
//     });

//     // Revalidate the cache
//     revalidatePath("/");

//     return { message: "Image uploaded successfully", blob };
//   } catch (error) {
//     console.error("Error uploading image:", error);

//     return { message: "Error uploading image" };
//   }
// }
//create table
// export async function createTable() {
//   try {
//     const result = await sql`
// CREATE TABLE users (
//   id BIGSERIAL PRIMARY KEY,
//   username TEXT NOT NULL,
//   email TEXT NOT NULL,
//   password TEXT NOT NULL,
//   image TEXT
// )
//       `;

//     return { message: "Table created successfully" };
//   } catch (error) {
//     console.error("Error creating table:", error);

//     return { message: "Error creating table" };
//   }
// }
