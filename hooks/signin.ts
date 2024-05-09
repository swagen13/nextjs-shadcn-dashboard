import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebaseConfig';

export default function useSignIn(email: string, password: string) {
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const signIn = async () => {
    console.log('email', email);
    try {
      const response = await signInWithEmailAndPassword(email, password);
      sessionStorage.setItem('User', JSON.stringify(response));
      setResult(response);
      console.log('result', response);
    } catch (e) {
      setError(e);
    }
  };

  return { signIn, result, error };
}
