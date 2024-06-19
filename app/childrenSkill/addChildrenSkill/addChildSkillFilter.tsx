"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Skill {
  id: string;
  name: string;
  parentid: string;
  children_count: number;
}

interface SkillFilterProps {
  parentSkills: Skill[];
  fetchSubSkills: (parentId: string) => Promise<Skill[]>;
  onSelectChange: (value: any) => void;
}

const SkillFilter: React.FC<SkillFilterProps> = ({
  parentSkills,
  fetchSubSkills,
  onSelectChange,
}) => {
  const [skills, setSkills] = useState<Skill[][]>([parentSkills]);

  useEffect(() => {
    console.log("skills", skills);
  }, [skills]);

  const handleSelectChange = async (value: string, level: number) => {
    console.log("value", value);

    onSelectChange(value);

    // Fetch subskills if a skill is selected
    if (value !== "all") {
      const subSkills = await fetchSubSkills(value);
      setSkills((prev) => {
        const newSkills = [...prev];
        newSkills[level + 1] = subSkills;
        return newSkills;
      });
    } else {
      // Reset skills if "Show All" is selected
      setSkills((prev) => prev.slice(0, level + 1));
    }
  };

  return (
    <div className="flex flex-wrap">
      {skills.map(
        (skillLevel, index) =>
          skillLevel.length > 0 && (
            <div key={index} className="mr-4">
              <Select
                onValueChange={(value) => handleSelectChange(value, index)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem key={`all-${index}`} value="all">
                      Show All
                    </SelectItem>
                    {skillLevel.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} ({skill.children_count})
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
