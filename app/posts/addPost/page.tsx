import { getAllSkills } from "@/app/skills/action";
import AddPostForm from "./AddPostForm";

interface AddPostPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function addPostsPage({ searchParams }: AddPostPageProps) {
  const skill = Array.isArray(searchParams.skill)
    ? searchParams.skill[0]
    : searchParams.skill;
  let skills: any[] = await getAllSkills();

  if (skill) {
    console.log("skill", skill);
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Posts</h1>
      </div>
      <AddPostForm parentSkill={skills} path={skill} />
    </div>
  );
}
