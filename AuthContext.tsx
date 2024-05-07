import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { firebase_app } from "./firebaseConfig";
import SignInPage from "./app/signin/page";
import { Sidebar } from "lucide-react";
import Header from "./components/header";
import PageWrapper from "./components/pagewrapper";
import SiginUpPage from "./app/signup/page";

const auth = getAuth(firebase_app);

export const AuthContext = createContext<{ user: any | null }>({ user: null });

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user", user);

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!user ? <SignInPage /> : <div>{children}</div>}
    </AuthContext.Provider>
  );
};
