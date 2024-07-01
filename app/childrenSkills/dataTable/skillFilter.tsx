// SkillFilter.tsx

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface SkillFilterProps {
  parentSkills: any[];
  subSkill?: any[];
  onSelectChange: (value: any) => void;
}

const SkillFilter: React.FC<SkillFilterProps> = ({
  parentSkills,
  subSkill,
  onSelectChange,
}) => {
  return (
    <div>
      <div className="mr-4">
        <Select onValueChange={onSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by parent skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Show All</SelectItem>
              {parentSkills ? (
                parentSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.parentid}>
                    {skill.name} ({skill.children_count})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="all">Show All</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {subSkill && subSkill.length > 0 && (
        <Select
          onValueChange={(value: any) => {
            console.log(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sub skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {subSkill.map((skill) => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.name} ({skill.children_count})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SkillFilter;
