import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const VendorView = (refreshKey: any) => {
  const { data: session } = useSession();
  const [vendors, setVendors] = useState<
    {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      vendorCompanyId: string;
    }[]
  >([]);

  useEffect(() => {
    if (session) {
      fetch(`/api/get-vendors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: (session?.user as any)?.id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setVendors(data.vendors);
        })
        .catch((error) => console.log("Error:", error));
    }
  }, [refreshKey]);

  return (
    <div className=" bg-white text-black rounded-lg">
      <table className="table-auto border-collapse w-full">
        <thead className="bg-black text-white">
          <tr>
            <th className="border border-gray-200 px-4 py-2">Vendor Name</th>
            <th className="border border-gray-200 px-4 py-2">Vendor Email</th>
            <th className="border border-gray-200 px-4 py-2">
              Vendor Phone Number
            </th>
            <th className="border border-gray-200 px-4 py-2">Vendor Company</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(vendors != undefined || vendors != null) &&
            vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="border border-gray-200 px-4 py-2">
                  {vendor.name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {vendor.email}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {vendor.phoneNumber}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {vendor.vendorCompanyId}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorView;
