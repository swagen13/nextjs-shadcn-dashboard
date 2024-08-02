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
  descriptions: JobPostDescription[];
  skill_id: string; // Change this line to string
}

export interface JobPostSubmission {
  show: boolean;
  job_title: string;
  wage: string;
  post_owner: string;
  descriptions: { description: string }[];
  skill_id: string; // Change this line to string
}

export interface JobPostEditSubmission {
  id: number;
  show: boolean;
  job_title: string;
  wage: string;
  post_owner: string;
  description: any;
  skill_id: string; // Change this line to string
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
  skill_id: z.string().optional(), // Change this line to string
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
  skill_id: z.string().min(1, {
    message: "Skill ID is required",
  }), // Change this line to string
});

export type EditJobPostSchemaType = z.infer<typeof EditJobPostSchema>;
