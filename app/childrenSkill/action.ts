"use server";

import { initAdmin } from "@/firebaseAdmin";
import { z } from "zod";
import { EditChidrentSkillSchema } from "./schema";

// get all skills information
export async function getChildrenSkills() {
  try {
    // get skills from firestore
    const adminApp = await initAdmin();
    const skills = await adminApp.firestore().collection("subSkills").get();

    // return skills
    return skills.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting users:", error);

    return [];
  }
}

// get skill by id
export async function getChildrenSkillById(id: string) {
  try {
    // get skill from firestore
    const adminApp = await initAdmin();
    const skill = await adminApp
      .firestore()
      .collection("subSkills")
      .doc(id)
      .get();

    // return skill
    return skill.data();
  } catch (error) {
    console.error("Error getting skill:", error);

    return null;
  }
}

// update skill
export async function updateChildrenSkill(formData: FormData) {
  const { id, name, description, translationName, subSkill } =
    EditChidrentSkillSchema.parse(Object.fromEntries(formData));

  const skill = {
    name,
    description,
    translations: [
      {
        locale: "en",
        name: translationName,
      },
    ],
    subSkillId: subSkill,
  };

  try {
    // update skill in firestore
    const adminApp = await initAdmin();
    await adminApp.firestore().collection("subSkills").doc(id).update(skill);

    // return success message
    return { message: "Skill updated successfully", status: true };
  } catch (error) {
    console.error("Error updating skill:", error);

    return { message: "Error updating skill" };
  }
}

// create a new skill
export async function createChildrenSkill(formData: FormData) {
  const schema = z.object({
    name: z.string(),
    description: z.string(),
    translationName: z.string(),
    subSkill: z.string(),
  });
  const { name, description, translationName, subSkill } = schema.parse(
    Object.fromEntries(formData)
  );

  try {
    // create skill in firestore
    const adminApp = await initAdmin();
    const skillId = adminApp.firestore().collection("subSkills").doc().id;

    // format is 2023-01-20T07:22:57.586Z
    const formattedDate = new Date().toISOString();

    const skillObject = {
      color: null,
      createdAt: formattedDate,
      description: description,
      subSkillId: subSkill,
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
      .collection("subSkills")
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

// delete sub skill
export async function deleteSubSkill(id: string) {
  try {
    // delete skill from firestore
    const adminApp = await initAdmin();
    await adminApp.firestore().collection("subSkills").doc(id).delete();

    // return success message
    return { message: "Skill deleted successfully", status: true };
  } catch (error) {
    console.error("Error deleting skill:", error);

    return { message: "Error deleting skill" };
  }
}
