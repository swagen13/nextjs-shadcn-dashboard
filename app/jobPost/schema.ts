import { z } from "zod";

// Interface for JobPosts table
export interface JobPost {
  id: number;
  show: boolean;
  job_title: string;
  wage: string;
  post_owner: string;
  created_at: Date;
  updated_at: Date;
  descriptions: JobPostDescription[]; // Add this line to include descriptions
}

export interface JobPostSubmission {
  show: boolean;
  job_title: string;
  wage: string;
  post_owner: string;
  descriptions: { description: string }[];
}
export interface JobPostEditSubmission {
  id: number;
  show: boolean;
  job_title: string;
  wage: string;
  post_owner: string;
  description: any;
}

// Interface for JobPostDescription table
export interface JobPostDescription {
  id: number;
  description: string;
  jobpost_id: number;
}

// Schema for JobPostDescription
const JobPostDescriptionSchema = z.object({
  description: z.string(),
});

// Schema for JobPost
export const JobPostSchema = z.object({
  show: z.boolean(),
  job_title: z.string().min(1, {
    message: "Job title is required",
  }),
  wage: z.string().min(1, {
    message: "Wage is required",
  }),
  post_owner: z.string().min(1, {
    message: "Post owner is required",
  }),
  descriptions: z.array(JobPostDescriptionSchema).nonempty({
    message: "At least one description is required",
  }),
});
export type JobPostSchemaType = z.infer<typeof JobPostSchema>;

export const EditJobPostSchema = z.object({
  id: z.number(),
  show: z.boolean(),
  job_title: z.string().min(1, {
    message: "Job title is required",
  }),
  wage: z.string().min(1, {
    message: "Wage is required",
  }),
  post_owner: z.string().min(1, {
    message: "Post owner is required",
  }),
  description: z.any(),
});

export type EditJobPostSchemaType = z.infer<typeof EditJobPostSchema>;
