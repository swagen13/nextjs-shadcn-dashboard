"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Swal from "sweetalert2";
import { updateSubSkill } from "../action";

const initialState = {
  message: "",
  status: false,
};

export default function EditSubSkillForm({ subSkillData, parentSkill }: any) {
  const [subSkill, setSubSkill] = useState<any>(subSkillData);
  const [state, formAction] = useFormState(updateSubSkill, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [parentSkills, setParentSkills] = useState<any>(parentSkill);

  useEffect(() => {
    if (state.message) {
      if (state.status) {
        Swal.fire({
          title: state.message,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: state.message,
          icon: "error",
        });
      }
    }
  }, [state]);

  if (!subSkill) {
    return <div>Loading...</div>;
  }

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        aria-disabled={pending}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md"
      >
        {"Edit"}
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-wrap -mx-2 flex-grow"
      ref={formRef}
    >
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mb-4 w-full sm:w-1/2 px-2">
              <input type="hidden" name="id" value={subSkill.id} />
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={subSkill.name}
                onChange={(e) =>
                  setSubSkill({ ...subSkill, name: e.target.value })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={subSkill.description ? subSkill.description : ""}
                onChange={(e) =>
                  setSubSkill({ ...subSkill, description: e.target.value })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
              />
            </div>
            <div className="mb-4 w-full sm:w-1/2 px-2">
              <label
                htmlFor="translationName"
                className="block text-sm font-medium text-gray-700"
              >
                Translation Name
              </label>
              <input
                type="text"
                id="translationName"
                name="translationName"
                value={subSkill.translations[0].name}
                onChange={(e) =>
                  setSubSkill({
                    ...subSkill,
                    translations: [
                      { ...subSkill.translations[0], name: e.target.value },
                    ],
                  })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
              <label
                htmlFor="parentSkill"
                className="block text-sm font-medium text-gray-700"
              >
                Sub Skill
              </label>
              <select
                id="parentSkill"
                name="parentSkill"
                value={subSkill.parentId}
                onChange={(e) =>
                  setSubSkill({ ...subSkill, parentId: e.target.value })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
              >
                {parentSkills.length > 0 ? (
                  parentSkills.map((skill: any) => (
                    <option key={skill.id} value={skill.parentId}>
                      {skill.name}
                    </option>
                  ))
                ) : (
                  <option value="">No Parent Skill</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
