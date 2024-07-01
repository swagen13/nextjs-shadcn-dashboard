import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPosts } from "./action";
import AddPostForm from "./addPost/AddPostForm";

export default async function PostPage() {
  const posts = await getPosts();

  console.log(posts);

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Post Page</h1>
        <Link href="/posts/addPost">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Post
          </Button>
        </Link>
      </div>
    </div>
  );
}
