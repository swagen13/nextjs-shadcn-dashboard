"use client";
// import SiginUpPage from "@/app/signup/page";
import useSignIn from "@/hooks/signin";
import { useEffect, useState } from "react";
import SiginUpPage from "../signup/page";

function SignInPage(BuildContext: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const { signInHandler, result, error } = useSignIn(email, password);

  useEffect(() => {
    const fetchSession = async () => {};
    fetchSession();
  }, []);

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      // Call the signIn function from useSignIn hook
      await signInHandler();
      // router.push("/");
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const handleSignUpClick = () => {
    setShowModal(true); // Open modal when "Sign Up" button is clicked
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleForm}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-3xl text-center font-bold mt-8 mb-6">Sign In</h1>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleSignUpClick} // Open modal when this button is clicked
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <div>
          <div className="fixed inset-0 bg-black opacity-50"></div>

          <SiginUpPage />
        </div>
      )}{" "}
    </div>
  );
}

interface ServerSidePropsWithSession {
  props: {
    session?: any; // Change 'any' to the actual type of your session object if known
  };
}

export default SignInPage;
