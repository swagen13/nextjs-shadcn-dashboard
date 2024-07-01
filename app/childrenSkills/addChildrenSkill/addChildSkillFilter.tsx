"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { filterSkillsByLevel } from "@/components/filter-skill";

interface Skill {
  id: string;
  skill_name: string;
  parent_id: string | null;
}

interface SkillFilterProps {
  parentSkills: any[];
  onSelectChange: (value: string[]) => void;
}

const SkillFilter: React.FC<SkillFilterProps> = ({
  parentSkills,
  onSelectChange,
}) => {
  const [skills, setSkills] = useState<any[]>(parentSkills);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillFilter, setSkillFilter] = useState<any[]>([]);
  const [skillNameMap, setSkillNameMap] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    // get skill level 1
    const skillLevel1 = filterSkillsByLevel(skills, 0);

    // set to object
    const skillLevel1Obj = skillLevel1.map((skill: Skill) => ({
      id: skill.id,
      skill_name: skill.skill_name,
      parent_id: skill.parent_id,
    }));

    // get parent skill where parent_id is null
    const parentSkill = skillLevel1Obj.filter(
      (skill: Skill) => skill.parent_id === null
    );

    // set to state
    setSkillFilter([parentSkill]);

    // create skill name map
    const initialSkillNameMap: { [key: string]: string } = {};
    skillLevel1Obj.forEach((skill: Skill) => {
      initialSkillNameMap[skill.id] = skill.skill_name;
    });
    setSkillNameMap(initialSkillNameMap);
  }, [parentSkills]);

  const handleSelectChange = async (value: string, level: number) => {
    // Update selected skills state
    const newSelectedSkills = [...selectedSkills.slice(0, level), value];
    setSelectedSkills(newSelectedSkills);
    onSelectChange(newSelectedSkills);

    // Reset skill filters beyond the current level
    const newSkillFilter = skillFilter.slice(0, level + 1);
    setSkillFilter(newSkillFilter);

    // level +1
    const nextLevel = level + 1;
    console.log("nextLevel", nextLevel);

    const subSkills = filterSkillsByLevel(skills, nextLevel);

    // set to object
    const subSkillsObj = subSkills.map((skill: Skill) => ({
      id: skill.id,
      skill_name: skill.skill_name,
      parent_id: skill.parent_id,
    }));

    // get skill where parent_id is equal to value
    const filteredSubSkills = subSkillsObj.filter(
      (skill: Skill) => skill.parent_id === value
    );

    if (filteredSubSkills.length === 0) {
      return;
    }

    // set to state
    newSkillFilter[nextLevel] = filteredSubSkills;
    setSkillFilter(newSkillFilter);

    // update skill name map
    const updatedSkillNameMap = { ...skillNameMap };
    filteredSubSkills.forEach((skill: Skill) => {
      updatedSkillNameMap[skill.id] = skill.skill_name;
    });
    setSkillNameMap(updatedSkillNameMap);
  };

  return (
    <div className="flex flex-wrap">
      {skillFilter.map(
        (skill, index) =>
          skill && (
            <div key={index} className="mr-4">
              <Select
                value={selectedSkills[index] || ""}
                onValueChange={(value) => handleSelectChange(value, index)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {selectedSkills[index]
                      ? skillNameMap[selectedSkills[index]]
                      : "Please select a skill"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {skill.map((skill: Skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.skill_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )
      )}
    </div>
  );
};

export default SkillFilter;
