import { getServerSession } from "next-auth/next";
import { config } from "@/pages/api/auth/[...nextauth]"; // Import your NextAuth config

export default async (req: any, res: any) => {
  const session = await getServerSession(req, res, config);
  res.status(200).json({ session });
};
