import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Artist() {
  const artistUsername = "john_doe";
  const queryParams = new URLSearchParams({ genre: "rock", year: "2023" });

  return (
    <div className="bg-gray-200 rounded-lg p-6 m-4">
      <h1>Artist</h1>
      <p>This is the main page for artists.</p>
      <Link href={`/artist/${artistUsername}?${queryParams.toString()}`}>
        <Button>Go to John Doe's Page</Button>
      </Link>
    </div>
  );
}
