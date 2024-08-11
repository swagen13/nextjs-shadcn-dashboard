import { z } from "zod";

// Interface for JobPosts table
export interface JobPost {
  id: number;
  show: string; // updated to match character varying type
  job_title: string;
  wage: string;
  post_owner: string;
  created_at: string; // or Date, depending on how you handle timestamps in your application
  updated_at: string; // or Date, depending on how you handle timestamps in your application
  description: any; // updated to match jsonb type
  skill_id: string; // updated to match character varying type
}

// Interface for JobPostSubmission
export interface JobPostSubmission {
  show: string; // updated to match character varying type
  job_title: string;
  wage: string;
  post_owner: string;
  description: { description: string }[]; // Assuming the JSON contains an array of description objects
  skill_id: string; // updated to match character varying type
}

// Interface for JobPostEditSubmission
export interface JobPostEditSubmission {
  id: number;
  show: string; // updated to match character varying type
  job_title: string;
  wage: string;
  post_owner: string;
  description: any; // updated to match jsonb type
  skill_id: string; // updated to match character varying type
}

// Schema for JobPostDescription
const JobPostDescriptionSchema = z.object({
  description: z.string(),
});

// Schema for JobPost
export const JobPostSchema = z.object({
  show: z.string().min(1, { message: "Show is required" }), // updated to match character varying type
  job_title: z.string().min(1, { message: "Job title is required" }),
  wage: z.string().min(1, { message: "Wage is required" }),
  post_owner: z.string().min(1, { message: "Post owner is required" }),
  description: z
    .array(JobPostDescriptionSchema)
    .nonempty({ message: "At least one description is required" }), // updated to match jsonb type
  skill_id: z.string().min(1, { message: "Skill ID is required" }), // updated to match character varying type
});

// Type for JobPostSchema
export type JobPostSchemaType = z.infer<typeof JobPostSchema>;

// Schema for editing a JobPost
export const EditJobPostSchema = z.object({
  id: z.preprocess((val) => parseInt(val as string, 10), z.number()), // แปลง string เป็น number ก่อนการ validate
  show: z.string().min(1, { message: "Show is required" }), // updated to match character varying type
  job_title: z.string().min(1, { message: "Job title is required" }),
  wage: z.string().min(1, { message: "Wage is required" }),
  post_owner: z.string().min(1, { message: "Post owner is required" }),
  description: z.any(),
  skill_id: z.string().min(1, { message: "Skill ID is required" }), // updated to match character varying type
});

// Type for EditJobPostSchema
export type EditJobPostSchemaType = z.infer<typeof EditJobPostSchema>;
