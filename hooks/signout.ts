// import { useState } from 'react';
// import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
// import { auth } from '@/firebaseConfig';

// export default function useSignOut() {
//   const [result, setResult] = useState<any | null>(null);
//   const [error, setError] = useState<any | null>(null);

//   const removeSession = async () => {
//     try {
//       const response = await auth.signOut();
//       sessionStorage.removeItem('User');
//       setResult(response);
//     } catch (e) {
//       setError(e);
//     }
//   };

//   return { removeSession, result, error };
// }
