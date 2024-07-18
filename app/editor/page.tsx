import { PlateEditor } from "./components/PlateEditor";

export default async function EditorPage() {
  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Editor</h1>
      </div>
      <PlateEditor />
    </div>
  );
}
