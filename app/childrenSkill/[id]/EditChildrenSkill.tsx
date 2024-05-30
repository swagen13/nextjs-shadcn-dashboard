"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Swal from "sweetalert2";
import { updateChildrenSkill } from "../action";

const initialState = {
  message: "",
  status: false,
};

export default function EditChildrenSkillForm({
  childrenSkillData,
  subSkills,
}: any) {
  const [childrenSkill, setChildrenSkill] = useState<any>(childrenSkillData);
  const [state, formAction] = useFormState(updateChildrenSkill, initialState);
  const formRef = useRef<HTMLFormElement>(null);

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

  if (!childrenSkill) {
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
              <input type="hidden" name="id" value={childrenSkill.id} />
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
                value={childrenSkill.name}
                onChange={(e) =>
                  setChildrenSkill({
                    ...childrenSkill,
                    name: e.target.value,
                  })
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
                value={
                  childrenSkill.description ? childrenSkill.description : ""
                }
                onChange={(e) =>
                  setChildrenSkill({
                    ...childrenSkill,
                    description: e.target.value,
                  })
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
                value={childrenSkill.translations[0].name}
                onChange={(e) =>
                  setChildrenSkill({
                    ...childrenSkill,
                    translations: [
                      {
                        ...childrenSkill.translations[0],
                        name: e.target.value,
                      },
                    ],
                  })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
              <label
                htmlFor="subSkill"
                className="block text-sm font-medium text-gray-700"
              >
                Sub Skill
              </label>
              <select
                id="subSkill"
                name="subSkill"
                value={childrenSkill.subSkillId}
                onChange={(e) =>
                  setChildrenSkill({
                    ...childrenSkill,
                    subSkillId: e.target.value,
                  })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
              >
                {subSkills.length > 0 ? (
                  subSkills.map((skill: any) => (
                    <option key={skill.id} value={skill.id}>
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
