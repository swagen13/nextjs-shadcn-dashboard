"use client";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SkillSchema, SkillSchemaType } from "../schema";
import Swal from "sweetalert2";
import { addSkill } from "../action";

// Define an interface for skill
interface Skill {
  id: number;
  skill_name: string;
  parent_id: string | null;
  sequence: string;
  level: number;
  children?: Skill[];
}

interface AddSkillFormProps {
  skills: Skill[];
}

function flattenSkills(skills: Skill[]): Skill[] {
  return skills.reduce((acc, skill) => {
    acc.push(skill);
    if (skill.children) {
      acc = acc.concat(flattenSkills(skill.children));
    }
    return acc;
  }, [] as Skill[]);
}

function formatSkillName(skill_name: string, level: number): string {
  return "-".repeat(level) + skill_name;
}

export default function AddSkillForm({ skills }: AddSkillFormProps) {
  const [sequence, setSeqence] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<SkillSchemaType>({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      skill_name: "",
      parent_id: "",
      sequence: "",
    },
  });

  const { handleSubmit, reset, formState } = form;
  const { isSubmitting, errors } = formState;

  const flattenedSkills = flattenSkills(skills);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("skill_name", data.skill_name);
    formData.append("parent_id", data.parent_id);
    // get all skills where parent_id == data.parent_id
    const parentSkill = flattenedSkills
      .filter((skill) => skill.id === Number(data.parent_id))
      .sort((a, b) => a.sequence.localeCompare(b.sequence))
      .pop();
    // get children of parent skill
    const children = flattenedSkills.filter(
      (skill) => skill.parent_id === data.parent_id
    );
    let skill_sequence = "";
    if (children.length > 0) {
      // get sequence of children
      const sequence = children.length
        ? children[children.length - 1].sequence
        : parentSkill?.sequence;
      // +1 in the last decimal place.
      const newSequence = sequence
        ? sequence.replace(/.$/, String(Number(sequence.slice(-1)) + 1))
        : "0";
      skill_sequence = newSequence;
    } else {
      // get sequence of parent skill
      skill_sequence = parentSkill?.sequence + ".1";
    }
    formData.append("sequence", skill_sequence);

    console.log("formData", formData);

    const response = await addSkill(formData);
    if (response.status) {
      Swal.fire({
        title: "Skill added successfully",
        icon: "success",
      });
      reset();
      formRef.current?.reset();
    } else {
      Swal.fire({
        title: "Error adding skill",
        icon: "error",
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-wrap -mx-2" ref={formRef}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mb-4 w-full sm:w-1/2 px-2">
                <FormField
                  control={form.control}
                  name="skill_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 w-full sm:w-1/2 px-2">
                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Skill</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="p-2 border rounded-md w-full"
                        >
                          <option value="">No parent</option>
                          {flattenedSkills.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                              {formatSkillName(skill.skill_name, skill.level)}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 w-full sm:w-1/2 px-2" hidden>
                <FormField
                  control={form.control}
                  name="sequence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sequence</FormLabel>
                      <FormControl>
                        <Input
                          disabled={true}
                          placeholder="Sequence"
                          {...field}
                          value={sequence}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <Spinner size={20} />
              ) : (
                <div className="flex items-center justify-center">
                  Add Skill
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
