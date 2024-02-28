"use client";
import { useEffect } from "react";
import { LogoutButton } from "./auth";
import Link from "next/link";
import { selectedState } from "../state/atoms/selectedState";
import { useRecoilState } from "recoil";
import Image from "next/image";
import User from "./user";

const Sidebar = ({ email, name }: any) => {
  const [selected, setSelected] = useRecoilState(selectedState);

  useEffect(() => {
    console.log("UPDATED", selected);
  }, [selected]);

  const handleClick = (event: any) => {
    setSelected(event.target.value);
    console.log(selected);
  };

  const states = ["Status", "New Order", "Vendors"];

  return (
    <div className="w-64 min-h-screen bg-white text-black border-r border-gray-200 p-8 flex flex-col justify-between">
      <div>
        <Link href="/">
          <h2 className="text-5xl font-semibold mb-4">
            nova<span className="text-nova">{">"}</span>
          </h2>
        </Link>
        <h1 className="pt-3 pb-5 rounded underline underline-offset-1"></h1>
        <nav>
          <ul>
            {states.map((e) => (
              <li
                key={e}
                className={`mb-2 ${
                  selected === e
                    ? "text-nova hover:text-nova-dark"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <button
                  value={e}
                  onClick={handleClick}
                  className={`hover:underline hover:underline-offset-1 ${
                    " " // selected === e ? "underline underline-offset-1" : ""
                  }`}
                >
                  {e}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div>
        <User name={name} email={email} />

        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
