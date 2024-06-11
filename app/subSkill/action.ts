"use server";
import { initAdmin } from "@/firebaseAdmin";
import { z } from "zod";
import { SubSkillSchema } from "./schema";

// get all skills information
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

// get skill by id
export async function getSubSkillById(id: string) {
  try {
    // get skill from firestore
    const adminApp = await initAdmin();
    const skill = await adminApp
      .firestore()
      .collection("skillChildrens")
      .doc(id)
      .get();

    // return skill
    return skill.data();
  } catch (error) {
    console.error("Error getting skill:", error);
    return null;
  }
}

// get sub skill from parent skill
export async function getSubSkillByParent(parentId?: string, page: number = 1) {
  if (!page) page = 1;
  let skills;

  try {
    // get skills from firestore
    const adminApp = await initAdmin();
    if (!parentId) {
      console.log("no parent id");

      skills = await adminApp
        .firestore()
        .collection("skillChildrens")
        .limit(10)
        .get();
    } else {
      console.log("parent id");
      skills = await adminApp
        .firestore()
        .collection("skillChildrens")
        .where("parentId", "==", parentId)
        .limit(10)
        .get();
    }

    // return skills
    return skills.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting skill:", error);
    return [];
  }
}

// get sub skill by name
export async function getSubSkillByName(name: string) {
  try {
    // Convert the search query to lowercase for case-insensitive matching
    const lowercaseName = name.toLowerCase();

    // Get skills from Firestore
    const adminApp = await initAdmin();
    const skillsSnapshot = await adminApp
      .firestore()
      .collection("skillChildrens")
      .get();

    // Filter skills based on partial name match
    const matchingSkills = skillsSnapshot.docs
      .map((doc) => doc.data())
      .filter((skill) => skill.name.toLowerCase().includes(lowercaseName));

    return matchingSkills;
  } catch (error) {
    console.error("Error getting skill:", error);
    return [];
  }
}

// update skill
export async function updateSubSkill(formData: FormData) {
  const schema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    translationName: z.string(),
    parentSkill: z.string(),
  });
  const { id, name, description, translationName, parentSkill } = schema.parse(
    Object.fromEntries(formData)
  );

  const skill = {
    name,
    description,
    translations: [
      {
        locale: "en",
        name: translationName,
      },
    ],
    parentId: parentSkill,
  };

  try {
    // update skill in firestore
    const adminApp = await initAdmin();
    await adminApp
      .firestore()
      .collection("skillChildrens")
      .doc(id)
      .update(skill);

    // return success message
    return { message: "Skill updated successfully", status: true };
  } catch (error) {
    console.error("Error updating skill:", error);
    return { message: "Error updating skill" };
  }
}

// create a new skill
export async function createSubSkill(formData: FormData) {
  const { name, description, translationName, parentSkill } =
    SubSkillSchema.parse(Object.fromEntries(formData));

  try {
    // create skill in firestore
    const adminApp = await initAdmin();
    const skillId = adminApp.firestore().collection("skillChildrens").doc().id;

    // format is 2023-01-20T07:22:57.586Z
    const formattedDate = new Date().toISOString();

    const skillObject = {
      color: null,
      createdAt: formattedDate,
      description: description,
      parentId: parentSkill,
      icon: null,
      id: skillId,
      name: name,
      translations: [
        {
          locale: "en",
          name: translationName,
        },
      ],
      updatedAt: formattedDate,
    };

    await adminApp
      .firestore()
      .collection("skillChildrens")
      .doc(skillId)
      .set(skillObject);

    // return success message
    return { message: "Skill created successfully", status: true };
  } catch (error) {
    console.error("Error creating skill:", error);
    return { message: "Error creating skill" };
  }
}

// get parent skills
export async function getSkillParents() {
  try {
    // get skills from firestore
    const adminApp = await initAdmin();
    const skills = await adminApp.firestore().collection("skills").get();

    // return skills
    return skills.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

// delete sub skill
export async function deleteSubSkill(id: string) {
  try {
    // delete skill from firestore
    const adminApp = await initAdmin();
    await adminApp.firestore().collection("skillChildrens").doc(id).delete();

    // return success message
    return { message: "Skill deleted successfully", status: true };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { message: "Error deleting skill" };
  }
}
