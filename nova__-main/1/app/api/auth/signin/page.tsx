"use client";
import { useEffect, useState } from "react";
import Input from "@/app/components/input";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  const [error, setError] = useState("");
  const [signInMethod, setSignInMethod] = useState("username");

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(credentials);

    const result = await signIn("credentials", {
      ...credentials,
      callbackUrl: "/dashboard",
    });

    if (!result) return;

    // Handle sign-in result/error
    if (!result.error) {
      // Successful sign-in, redirect to dashboard or desired page
      console.log("Sign-in successful");
    } else {
      // Error during sign-in
      setError(result.error);
    }
  };

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event: { target: { name: any; value: any } }) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex justify-center items-center h-screen">
        <div className="p-8 w-full max-w-sm bg-white text-black rounded-lg shadow-2xl">
          <a href="/">
            <h2 className="text-5xl font-semibold mb-4">
              nova<span className="text-nova">{">"}</span>
            </h2>
          </a>
          <h1 className="mb-4 text-2xl text-left">Sign in.</h1>
          <div className="mb-4">
            <div className="flex border-2 border-grey-300 rounded-lg overflow-hidden">
              <button
                className={`flex-1 py-2 text-center ${
                  signInMethod === "username"
                    ? "text-white bg-nova"
                    : "bg-white text-black"
                }`}
                onClick={() => setSignInMethod("username")}
              >
                Username
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  signInMethod === "email"
                    ? "text-white bg-nova"
                    : "bg-white text-black"
                }`}
                onClick={() => setSignInMethod("email")}
              >
                Email
              </button>
            </div>
          </div>
          {signInMethod === "username" && (
            <div className="mb-4">
              <div className="mb-2 text-sm">username</div>
              <Input
                type="text"
                name="username"
                placeholder="username"
                onChange={handleChange}
              />
            </div>
          )}
          {signInMethod === "email" && (
            <div className="mb-4">
              <div className="mb-2 text-sm">email</div>
              <Input
                type="email"
                name="email"
                placeholder="join@nova.ai"
                onChange={handleChange}
              />
            </div>
          )}
          <div className="mb-4">
            <div className="mb-2 text-sm">password</div>
            <Input
              type="password"
              name="password"
              placeholder="password123_;)"
              onChange={handleChange}
            />
          </div>
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
          <button className="w-full py-2 px-4 text-center bg-nova rounded text-white">
            Sign In
          </button>
          <div className="text-sm pt-3 mt-3 flex justify-center">
            Don&apos;t have an account?&nbsp;
            <Link href="/register" className="text-nova hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
