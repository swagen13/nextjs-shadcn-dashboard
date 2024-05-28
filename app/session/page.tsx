// // ServerSession.tsx
import { config } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function ServerSession() {
  const session = await getServerSession();
  return session;
}
