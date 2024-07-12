// DragAndDropPage.tsx
import React, { StrictMode } from "react";
import { getSkills } from "./action";
import { SortableTree } from "./SortableTree";
import { TreeItem, TreeItems } from "./types";
import { buildTree } from "./utilities";

interface SkillsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DragAndDropPage() {
  const skills = await getSkills();

  // get id , children data only from skills and changes id to string
  const treeItems: TreeItems = skills.map(({ id, children, skill_name }) => ({
    id: id.toString(),
    collapsed: true,
    children: children.map(({ id, children, skill_name }: any) => ({
      id: id.toString(),
      collapsed: true,
      children: children.map(({ id, children, skill_name }: any) => ({
        id: id.toString(),
        collapsed: true,
        children: children.map(({ id, skill_name }: any) => ({
          id: id.toString(),
          skill_name,
          collapsed: true,
          children: [],
        })),
        skill_name,
      })),
      skill_name,
    })),
    skill_name,
  }));

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Skills</h1>
      </div>
      <SortableTree skill={treeItems} />
    </div>
  );
}
