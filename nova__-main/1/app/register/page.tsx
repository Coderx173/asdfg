"use client";
import React, { useState, useEffect } from "react";
import { ExclamationIcon } from "@heroicons/react/outline";
import Link from "next/link";
import Input from "../components/input";
import { useRouter } from "next/navigation";

export default function Register() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  // client side page sending stuff...
  const { push } = useRouter();
  useEffect(() => {
    if (submitted) push("/api/auth/signin");
  }, [submitted]);

  const [credentials, setCredentials] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
  });

  const handleChange = (event: any) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const credentialsAndPassword = { ...credentials, password };

    console.log(credentialsAndPassword);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(credentialsAndPassword),
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.ok) {
        // redirect to homepage...
        console.log("here");
        setSubmitted(true);
      }
    } catch (e) {
      console.log(e);
    }
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
          <h1 className="mb-4 text-2xl text-left">Create an account.</h1>
          <div className="flex justify-between -mx-3">
            <div className="w-1/2 px-3 mb-4">
              <div className="mb-2 text-sm">First Name</div>
              <Input
                type="text"
                name="firstname"
                placeholder="First name"
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2 px-3 mb-4">
              <div className="mb-2 text-sm">Last Name</div>
              <Input
                type="text"
                name="lastname"
                placeholder="Last name"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-2 text-sm">Username</div>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <div className="mb-2 text-sm">Email</div>
            <Input
              type="email"
              name="email"
              placeholder="join@nova.ai"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <div className="mb-2 text-sm">Password</div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="mb-2 text-sm">Confirm Password</div>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              disabled={!password}
            />
            {!passwordsMatch && (
              <div className="text-red-600 text-sm mt-1 flex items-center transition-opacity duration-500 ease-in-out">
                <ExclamationIcon className="h-5 w-5 mr-1" />
                Passwords do not match
              </div>
            )}
          </div>
          <button
            disabled={password !== confirmPassword}
            className="w-full py-2 px-4 text-center bg-nova rounded text-white"
          >
            Register
          </button>
          <div className="mb-4 flex justify-center">
            <div className="text-sm pt-3 mt-3">
              Have an account?{" "}
              <Link
                href="/api/auth/signin"
                className="text-nova hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
