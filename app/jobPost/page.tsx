import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import { getJobPost } from "./action";
import { jobPostColumns } from "./dataTable/column";
import { JobPostDataTable } from "./dataTable/dataTable";
interface JobPostPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function JobPostPage({ searchParams }: JobPostPageProps) {
  const name = Array.isArray(searchParams.name)
    ? searchParams.name[0]
    : searchParams.name;
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit;
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;

  const pageParam = parseInt(page as string);

  // parse the limit to an integer
  const limitParam = parseInt(limit as string);

  const job_post = await getJobPost(pageParam, limitParam, name);

  let close = false;

  if (job_post.length !== limitParam + 1) {
    close = true;
    if (job_post.length > limitParam) {
      job_post.pop();
    }
    // remove the last index from the job_post array
  } else {
    close = false;
    job_post.pop();
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Job Post</h1>
        <div className="flex1">
          <Link rel="preload" href="/jobPost/addJobPost">
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            >
              <BsPlus size={25} />
              Add Job Post
            </Button>
          </Link>
        </div>
      </div>
      <JobPostDataTable
        data={job_post}
        columns={jobPostColumns}
        closeNextPage={close}
      />
    </div>
  );
}
