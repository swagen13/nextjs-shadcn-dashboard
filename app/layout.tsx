// layout.tsx

import { getServerSession } from "next-auth/next";
import { Karla } from "next/font/google";
import Header from "../components/header";
import PageWrapper from "../components/pagewrapper";
import Sidebar from "../components/sidebar";
import "./globals.css";
import { initAdmin } from "@/firebaseAdmin"; // Import initAdmin function
import { config } from "@/pages/api/auth/[...nextauth]";
import SignInPage from "./signin/page";

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-karla",
});

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={karla.className}>
        <InnerLayout>{children}</InnerLayout>
      </body>
    </html>
  );
}

async function InnerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Initialize Firebase Admin (handled by middleware, so this might be redundant)
  await initAdmin();

  const session = await getServerSession(config);

  if (session) {
    await getUserData(session.user.id);
  } else {
    console.log("no session");
  }

  return (
    <div className="flex">
      {session ? (
        <>
          <Sidebar />
          <div className="flex flex-col w-full">
            <Header />
            <PageWrapper>{children}</PageWrapper>
          </div>
        </>
      ) : (
        <div className="flex flex-col w-full">
          <SignInPage />
        </div>
      )}
    </div>
  );
}

export async function getUserData(id: string) {
  try {
    const adminApp = await initAdmin();
    const userDoc = await adminApp
      .firestore()
      .collection("users")
      .doc(id)
      .get();

    if (!userDoc.exists) {
      console.log("User document not found for ID:", id);
      return null;
    }

    return userDoc.data();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
