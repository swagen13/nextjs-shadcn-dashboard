"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Swal from "sweetalert2";
import { createSubSkill, getSubSkills } from "../action";

const initialState = {
  message: "",
  status: false,
};

function AddChildrenSkill() {
  const [state, formAction] = useFormState(createSubSkill, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [subSkills, setSubSkills] = useState<any>([]);

  useEffect(() => {
    getSubSkills().then((data) => {
      setSubSkills(data);
    });
  }, []);

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

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        type="submit"
        aria-disabled={pending}
        size="default"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Add
      </Button>
    );
  }

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Add Children Skill</h1>
      </div>

      <form
        action={formAction}
        className="flex flex-wrap -mx-2 flex-grow"
        ref={formRef}
      >
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mb-4 w-full sm:w-1/2 px-2">
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
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                  required
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
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                >
                  {subSkills.length > 0 ? (
                    subSkills.map((skill: any) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No parent skill found</option>
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
    </div>
  );
}

export default AddChildrenSkill;
