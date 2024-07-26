// Preview page.tsx

import { getJobPostById } from "./action";
import JobPostPreview from "./jobPostPreview";

interface JobPostPreviewPageProps {
  params: { id: number };
}

export default async function JobPostPreviewPage({
  params,
}: JobPostPreviewPageProps) {
  const jobPost = await getJobPostById(params.id);

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-4">Job Post Preview</h1>
      </div>
      <JobPostPreview jobPost={jobPost} />
    </div>
  );
}
