// useSignIn hook
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function useSignIn(email: string, password: string) {
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);

  const signInHandler = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("response", response);

      if (response) {
        const signInResponse = await signIn("credentials", {
          uid: response.user.uid,
          email: response.user.email,
        });
        // Set the result to the signInResponse
      }
      setResult(response);
    } catch (e) {
      console.log("error", e);
      setError(e);
    }
  };

  return { signInHandler, result, error };
}
