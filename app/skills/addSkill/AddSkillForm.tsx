"use client";
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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useFormState, useFormStatus } from "react-dom";
import { useForm, useWatch } from "react-hook-form";
import { addSkill } from "../action";
import { SkillData, SkillSchema, SkillSchemaType } from "../schema";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { put } from "@vercel/blob";
import { BsXCircleFill } from "react-icons/bs";

const initialState = {
  message: "",
  status: false,
};

interface AddSkillFormProps {
  skills: SkillData[];
}

function flattenSkills(skills: SkillData[]): SkillData[] {
  return skills.reduce((acc, skill) => {
    acc.push(skill);
    if (skill.children) {
      acc = acc.concat(flattenSkills(skill.children));
    }
    return acc;
  }, [] as SkillData[]);
}

function formatSkillName(name: string, level: number): string {
  return "-".repeat(level) + name;
}

export default function AddSkillForm({ skills }: AddSkillFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [translations, setTranslations] = useState([{ locale: "", name: "" }]);
  const [sequence, setSequence] = useState<string>("0");
  const [state, formAction] = useFormState(addSkill, initialState);
  const [color, setColor] = useColor("#561ecb");
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const defaultImageUrl = "/no_photo_icon.jpg";

  const form = useForm<SkillSchemaType>({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      name: "",
      color: "",
      description: "",
      icon: "",
      parent_id: "",
      sequence: 1,
      skill_image: "",
      slug: "",
      translations: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  const { reset, formState, setValue } = form;

  const flattenedSkills = flattenSkills(skills);

  useEffect(() => {
    console.log("state", state);
    if (state.message) {
      // if status is true display sweet alert
      if (state.status) {
        Swal.fire({
          title: state.message,
          icon: "success",
        });
        // reset();
        // router.push(`/skills`);
      } else {
        Swal.fire({
          title: state.message,
          icon: "error",
        });
      }
    }
  }, [state]);

  useEffect(() => {
    console.log("sequence", sequence);
  }, [sequence]);

  useEffect(() => {
    console.log("form", form.getValues());
  }, [form]);

  const calculateSequence = (parentId: string): string => {
    // Fetch the parent skill if parentId is provided
    const parentSkill = parentId
      ? flattenedSkills.find((skill) => skill.id === parentId)
      : null;
    console.log("Parent Skill", parentSkill);

    if (!parentSkill) {
      throw new Error("Parent skill not found");
    }

    // Fetch all children skills that have the same parent_id
    const children = flattenedSkills
      .filter((skill) => skill.parent_id === parentId)
      .sort((a: any, b: any) => a.sequence?.localeCompare(b.sequence));

    console.log("Children", children);

    let newSequence: string;

    if (children.length > 0) {
      // Get the last child's sequence and increment the last part
      const lastChild = children[children.length - 1];
      const sequence = lastChild.sequence || "0"; // Default to "0" if sequence is null

      const sequenceParts = sequence.split(".").map(Number);

      // Increment the last part of the sequence
      sequenceParts[sequenceParts.length - 1] += 1;
      newSequence = sequenceParts.join(".");
    } else {
      // No children found, create a new sequence based on the parent's sequence
      newSequence = `${parentSkill.sequence}.1`;
    }

    return newSequence;
  };

  // Update sequence state when parent_id changes
  const handleParentIdChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newParentId = e.target.value;

    console.log("New Parent ID:", newParentId);

    setValue("parent_id", newParentId); // Update form field value

    if (newParentId === "") {
      // Fetch existing sequences for top-level skills (where parent_id is empty or null)
      const topLevelSkills = flattenedSkills
        .filter((skill) => !skill.parent_id || skill.parent_id === "")
        .sort((a: any, b) => a.sequence?.localeCompare(b.sequence));

      let newSequence: string;

      if (topLevelSkills.length > 0) {
        // Get the last top-level skill's sequence and increment the last part
        const lastSkill = topLevelSkills[topLevelSkills.length - 1];
        const sequence = lastSkill.sequence ?? "0"; // Default to "0" if sequence is null
        const sequenceParts = sequence.split(".").map(Number);

        // Increment the last part of the sequence
        sequenceParts[sequenceParts.length - 1] += 1;
        newSequence = sequenceParts.join(".");
      } else {
        // If there are no top-level skills, start with "1"
        newSequence = "1";
      }

      console.log("Calculated Sequence for top-level skill:", newSequence);

      setSequence(newSequence); // Store the sequence as a string
      setValue("sequence", parseFloat(newSequence)); // Store the sequence as a number
    } else {
      // Calculate new sequence based on selected parent_id
      const newSequence = calculateSequence(newParentId);

      console.log("Calculated Sequence:", newSequence);

      setSequence(newSequence); // Store the sequence as a string
      setValue("sequence", parseFloat(newSequence)); // Store the sequence as a number
    }
  };

  // on change of color
  const handleColorChange = (color: string) => {
    setValue("color", color);
  };

  const handleTranslationChange = (
    index: number,
    key: string,
    value: string
  ) => {
    console.log("value", value);

    const newTranslations = translations.map((translation, i) => {
      if (i === index) {
        return { ...translation, [key]: value };
      }
      return translation;
    });

    setTranslations(newTranslations);
  };

  function formatSkillName(skill_name: string, level: number): string {
    return "-".repeat(level) + skill_name;
  }

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    );
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Set preview URL to the form field if needed
      setValue("skill_image", previewUrl);
    }
  };

  const handleIconChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const resizedImage = await resizeImage(file, 200, 200);
      console.log("Resized Image", resizedImage);
      const url = URL.createObjectURL(resizedImage);
      setValue("icon", url);
      setIconPreview(url);
    }
  };

  const resizeImage = (
    file: File,
    width: number,
    height: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          }, file.type);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };

  const handleRemoveImage = () => {
    setImagePreview(""); // Reset the preview URL
    setSelectedImage(null); // Reset the selected image
    setValue("skill_image", ""); // Reset the form field value
    // set image input placeholder
    const input = formRef.current?.querySelector(
      'input[name="skill_image"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const handleRemoveIcon = () => {
    setIconPreview(""); // Reset the preview URL
    setValue("icon", ""); // Reset the form field value
    // set icon input placeholder
    const input = formRef.current?.querySelector(
      'input[name="icon"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  return (
    <Form {...form}>
      <form
        action={formAction}
        className="bg-white p-6 rounded-lg shadow-md"
        ref={formRef}
      >
        <div className="flex flex-col gap-6">
          {/* Main content area with fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
            {/* Main form fields */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                <div className="md:col-span-2 lg:col-span-2">
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Name"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Skill</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          onChange={(e) => handleParentIdChange(e)}
                          className="p-2 border rounded-md w-full"
                        >
                          <option value="">No parent</option>
                          {flattenedSkills
                            .filter((skill) => skill.id !== null)
                            .map((skill) => (
                              <option
                                key={skill.id!.toString()}
                                value={skill.id!.toString()}
                              >
                                {formatSkillName(skill.name, skill.level ?? 0)}
                              </option>
                            ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Slug"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-4">
                  {translations.map((translation, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-6 md:grid-cols-2"
                    >
                      <FormField
                        name={`translations.${index}.locale`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm md:text-md">
                              Translations Locale
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Locale"
                                {...field}
                                className="w-full"
                                value={translation.locale}
                                onChange={(e) =>
                                  handleTranslationChange(
                                    index,
                                    "locale",
                                    e.target.value
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`translations.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm md:text-md">
                              Translations Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Name"
                                {...field}
                                className="w-full"
                                value={translation.name}
                                onChange={(e) =>
                                  handleTranslationChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>

                <div className="md:col-span-2 lg:col-span-2">
                  <FormField
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Description"
                            {...field}
                            className="p-2 border rounded-md w-full"
                            rows={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-2">
                  <FormField
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Color"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-2">
                    <ColorPicker
                      color={color}
                      onChange={(color) => {
                        setColor(color);
                        handleColorChange(color.hex);
                      }}
                      hideAlpha
                      hideInput
                      height={60}
                    />
                  </div>
                </div>
                <FormField
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Icon</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            field.onChange(event);
                            handleIconChange(event);
                          }}
                          name={field.name}
                          ref={field.ref}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preview Icon */}
                <div className="relative mt-4">
                  {iconPreview ? (
                    <>
                      <img
                        src={iconPreview}
                        alt="Icon Preview"
                        width={200}
                        height={200}
                        className="object-cover"
                      />
                      <button
                        onClick={handleRemoveIcon}
                        className="absolute -top-2 -right-2 text-red-600 rounded-full hover:text-red-300"
                      >
                        <BsXCircleFill className="text-xl" />{" "}
                        {/* ขยายขนาดไอคอนตามต้องการ */}
                      </button>
                    </>
                  ) : (
                    <img
                      src="/no_photo_icon.jpg" // Path to your default image
                      alt="No Photo"
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Image upload and preview */}
            <div className="lg:col-span-1 flex flex-col items-end">
              <FormField
                name="skill_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          field.onChange(event);
                          handleImageChange(event);
                        }}
                        name={field.name}
                        ref={field.ref}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative mt-4 w-full">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Icon Preview"
                      className="w-full h-auto object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 text-red-600 rounded-full hover:text-red-300"
                    >
                      <BsXCircleFill className="text-2xl" />{" "}
                    </button>
                  </>
                ) : (
                  <img
                    src="/no_photo_icon.jpg" // Path to your default image
                    alt="No Photo"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            </div>

            <div className="hidden">
              <FormField
                name="sequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="hidden">
              <FormField
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Color Picker and additional fields */}
        </div>

        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}
