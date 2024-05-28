"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getSkillById, updateSkill } from "../action";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

const initialState = {
  message: "",
  status: false,
};

export default function EditSkillPage({ params }: { params: { id: string } }) {
  const [skill, setSkillData] = useState<any>(null);
  const [state, formAction] = useFormState(updateSkill, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getSkillById(params.id).then((data) => {
      setSkillData(data);
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

  if (!skill) {
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
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Edit Skill</h1>
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
                <input type="hidden" name="id" value={skill.id} />
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
                  value={skill.name}
                  onChange={(e) =>
                    setSkillData({ ...skill, name: e.target.value })
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
                  value={skill.description ? skill.description : ""}
                  onChange={(e) =>
                    setSkillData({ ...skill, description: e.target.value })
                  }
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
                  value={skill.translations[0].name}
                  onChange={(e) =>
                    setSkillData({
                      ...skill,
                      translations: [
                        { ...skill.translations[0], name: e.target.value },
                      ],
                    })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-blue-500"
                  required
                />
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
