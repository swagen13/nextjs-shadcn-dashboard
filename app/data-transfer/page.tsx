"use client";
import { useEffect, useState } from "react";
import { getSkills } from "../skills/action";
import { getChildrenSkills, transferDataToPostgres } from "./action";

export default function DataTransfer() {
  const [skills, SetSkills] = useState<any>();
  const [getSkillsFromVercel, SetSkillsFromVercel] = useState<any>();

  useEffect(() => {
    // get skills from firestore
    const getSkillsFromFirebase = async () => {
      //   const skills = await getSkills();
      const skills = await getChildrenSkills();

      SetSkills(skills);
    };

    getSkillsFromFirebase();
  }, []);

  const handleTransfer = async () => {
    const result = await transferDataToPostgres(skills);
    SetSkillsFromVercel(result);
  };

  return (
    <div>
      <h1>Data Transfer</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>Firestore Skills</h2>
          <ul>
            {skills?.map((skill: any) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </ul>
        </div>
        <button onClick={handleTransfer}>Transfer</button>
        <div>
          <h2>PostgreSQL Skills</h2>
          <ul>
            {getSkillsFromVercel ? (
              getSkillsFromVercel.map((skill: any) => (
                <li key={skill.id}>{skill.name}</li>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
