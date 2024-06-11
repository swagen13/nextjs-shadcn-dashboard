"use server";
import { put } from "@vercel/blob";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { File } from "formdata-node";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import postgres, { PostgresError } from "postgres";
import { z } from "zod";
import { config } from "../../pages/api/auth/[...nextauth]";
import { initAdmin } from "@/firebaseAdmin"; // Import initAdmin function
import { UserData } from "@/app/data/schema";

interface User {
  createdAt: string;
  disabled: boolean;
  displayName: string;
  email: string;
  emailVerified: boolean;
  lastLoginAt: string;
  phoneNumber: string;
  photoURL: string;
  providerEmail: string;
  providerId: string;
  providerUid: string;
  uid: string;
}

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

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

export async function getUserData(email: string) {
  try {
    console.log("email:", email);

    const db = getFirestore();

    let user: any;

    const usersCollection = collection(db, "users");

    const usersSnapshot = await getDocs(usersCollection);

    usersSnapshot.forEach((doc) => {
      if (doc.data().email === email) {
        user = doc.data();
      }
    });

    if (user) {
      return {
        id: user.uid,
        username: user.username,
      };
    } else {
      // If user not found, return null
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function getUserProfile() {
  const session = await getServerSession(config);
  const adminApp = await initAdmin();
  const userDoc = await adminApp
    .firestore()
    .collection("users")
    .doc(session.user.id)
    .get();

  if (!userDoc.exists) {
    console.log("User document not found for ID:", session.user.id);
    return null;
  }

  // convert the userDoc data to the User schema
  return userDoc.data() as User;
}

export async function updateUserProfile(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    uid: z.string(),
    displayName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    image: z.instanceof(File).optional(),
  });

  const { uid, displayName, email, phoneNumber, image } = schema.parse(
    Object.fromEntries(formData)
  );

  try {
    const adminApp = await initAdmin();
    const userDoc = adminApp.firestore().collection("users").doc(uid);

    let photoURL;

    // Check if an image is provided
    if (image && image.size > 0) {
      // Read the image buffer from FormData
      const imageBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);

      // Compress the image (you should implement compressImage function)
      const compressedImageBuffer = await compressImage(buffer);

      // set file name
      const fileName = `profileImage/${uid}/${image.name}-${Date.now()}`;

      // Set reference to the storage bucket
      const bucket = adminApp.storage().bucket().file(fileName);

      // Upload the compressed image to the server
      await bucket.save(compressedImageBuffer, {
        metadata: {
          contentType: image.type,
        },
      });

      // Get the image URL
      photoURL = await bucket.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      });

      console.log("photoURL:", photoURL);
    }

    // Update the user document with the new data
    if (photoURL) {
      await userDoc.update({
        displayName,
        email,
        phoneNumber,
        photoURL,
      });
    } else {
      await userDoc.update({
        displayName,
        email,
        phoneNumber,
      });
    }

    return { message: "User profile updated successfully" };
  } catch (error) {
    console.error("Error updating user profile:", error);

    return { message: "Error updating user profile" };
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

export async function getServerSideProps(config: any) {
  const session = await getServerSession(config);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

// get parent skills
export async function getSubSkills() {
  try {
    // get skills from firestore
    const adminApp = await initAdmin();
    const skills = await adminApp
      .firestore()
      .collection("skillChildrens")
      .get();

    // return skills
    return skills.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting users:", error);

    return [];
  }
}
export async function getSubSkillByParent(parent: string) {
  return getSubSkills().then((data) =>
    data.filter((skill) => skill.parentId === parent)
  );
}
