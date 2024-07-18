import { del } from "@vercel/blob";

export const config = {
  runtime: "edge",
};

export default async function deleteImage(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url") as string;

  if (!urlToDelete) {
    return new Response("No URL provided", { status: 400 });
  }

  try {
    await del(urlToDelete, {
      token: "vercel_blob_rw_d0shhpZLmtvsciZy_E4yCTlGweo2ZfNrkiAoYbk7D2tYe12",
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(`Error deleting image: ${error}`, { status: 500 });
  }
}
