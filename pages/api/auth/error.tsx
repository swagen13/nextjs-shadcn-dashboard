import { NextPage } from "next";

const ErrorPage: NextPage = () => {
  return (
    <div>
      <h1>Sign-in Error</h1>
      <p>Oops! An error occurred during the sign-in process.</p>
      {/* You can provide additional error details or instructions here */}
    </div>
  );
};

export default ErrorPage;
