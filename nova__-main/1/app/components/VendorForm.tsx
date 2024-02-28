import React, { useState, useEffect } from "react";
import Input from "../components/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface VendorFormProps {
  onSubmit: () => void;
  onClose: () => void; // New prop for handling close button click
}

export default function VendorForm({
  onSubmit: handleFormSubmit,
  onClose: handleClose, // New prop for handling close button click
}: VendorFormProps) {
  const { data: session } = useSession();
  const [submitted, setSubmitted] = useState(false);
  // client side page sending stuff...
  // const { push } = useRouter();
  // useEffect(() => {
  //   if (submitted) push("/dashboard");
  // }, [submitted]);

  const [credentials, setCredentials] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    vendorcompany: "",
  });

  const handleChange = (event: any) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const credentials_ = { ...credentials };

    console.log(credentials_);

    try {
      const res = await fetch("/api/register-vendor", {
        method: "POST",
        body: JSON.stringify({
          data: credentials_,
          userId: (session?.user as any)?.id,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.ok) {
        // redirect to homepage...
        console.log("here");
        console.log(res.body);
        setSubmitted(true);
        handleFormSubmit();
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
              {/* <button
                onClick={handleClose}
                className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-800"
              >
                X
              </button> */}
              nova<span className="text-nova">{">"}</span>
            </h2>
          </a>
          <h1 className="mb-4 text-2xl text-left">Register a vendor.</h1>
          <div className="flex justify-between -mx-3">
            <div className="w-1/2 px-3 mb-4">
              <div className="mb-2 text-sm">Vendor First Name</div>
              <Input
                type="text"
                name="firstname"
                placeholder="First name"
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2 px-3 mb-4">
              <div className="mb-2 text-sm">Vendor Last Name</div>
              <Input
                type="text"
                name="lastname"
                placeholder="Last name"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-2 text-sm">Phone #</div>
            <Input
              type="text"
              name="phone"
              placeholder="Phone #"
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
            <div className="mb-2 text-sm">Vendor Company</div>
            <Input
              type="vendorcompany"
              name="vendorcompany"
              placeholder="Better CNC"
              onChange={handleChange}
            />
          </div>
          <button
            disabled={credentials["email"].trim() === ""}
            className="w-full py-2 px-4 text-center bg-nova rounded text-white"
          >
            Register Vendor
          </button>
        </div>
      </div>
    </form>
  );
}
