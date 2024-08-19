// DragAndDropPage.tsx
// import { getSkills } from "./action";
import { getSkills } from "./action";
import { SortableTree } from "./SortableTree";
import { TreeItems } from "./types";

interface SkillsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DragAndDropPage() {
  const skills = await getSkills();

  // get id , children data only from skills and changes id to string
  const treeItems: TreeItems = skills.map(({ id, children, name }) => ({
    id: id.toString(),
    collapsed: true,
    children: children.map(({ id, children, name }: any) => ({
      id: id.toString(),
      collapsed: true,
      children: children.map(({ id, children, name }: any) => ({
        id: id.toString(),
        collapsed: true,
        children: children.map(({ id, name }: any) => ({
          id: id.toString(),
          name,
          collapsed: true,
          children: [],
        })),
        name,
      })),
      name,
    })),
    name,
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
