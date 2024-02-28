"use client";
import { signIn, signOut } from "next-auth/react";
import Button from "./button";

export const LoginButton = () => {
  return <Button text="Sign in" onClick={() => signIn()} className="" />;
};

export const LogoutButton = () => {
  return (
    <Button text="Sign out" onClick={() => signOut()} className="px-3.5 py-2" />
  );
};
