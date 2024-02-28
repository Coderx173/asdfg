"use client";
import { Key, useState } from "react";
import { XIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { POST } from "../api/new-order/route";
import { useEffect } from "react";

const TableComponent = () => {
  const { data: session } = useSession();
  // console.log(session?.user?.id);
  // sxshopxs --> logs 11

  // TODO:
  //! Add in a column where individuals can select from a drop down bar an add vendors to contact for each line item
  // FETCHING VENDORS
  const [vendors, setVendors] = useState<
    {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      vendorCompanyId: string;
    }[]
  >([]);

  const [orderRefId, setOrderRefId] = useState("");

  useEffect(() => {
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
        console.log((session?.user as any)?.id);
        console.log("Received data:", data);
        setVendors(data.vendors);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  const [headers, setHeaders] = useState([
    "Item ID",
    "Material",
    "Dimensions",
    "Quantity",
    "Specifications",
    "Need Date",
    "Vendors",
  ]);

  const [table, setTable] = useState([
    Array(headers.length - 1)
      .fill("")
      .concat([[]]),
  ]);

  const addRow = () => {
    setTable([...table, Array(headers.length).fill("")]);
  };

  const deleteRow = (index: number) => {
    if (table.length > 1) {
      const newTable = [...table];
      newTable.splice(index, 1);
      setTable(newTable);
    }
  };

  const addColumn = () => {
    const tempHeaders = [...headers];
    tempHeaders.splice(tempHeaders.length - 1, 0, "<CHANGE PROPERTY>");
    setHeaders(tempHeaders);
    setTable(table.map((row) => [...row.slice(0, -1), "", row.slice(-1)[0]]));
  };

  const deleteColumn = (index: number) => {
    if (
      headers.length > 1 &&
      headers[index] !== "Need Date" &&
      headers[index] !== "Item ID" &&
      index !== headers.length - 1
    ) {
      const newHeaders = [...headers];
      newHeaders.splice(index, 1);
      setHeaders(newHeaders);
      setTable(
        table.map((row) => {
          const newRow = [...row];
          newRow.splice(index, 1);
          return newRow;
        })
      );
    }
  };

  // @FIXED... 07/15/2023 20:27:21
  // const submitTable = async () => {
  //   const tableData = table.map((row) => {
  //     const rowData: { [key: string]: string } = {};
  //     row.forEach((cell, index) => {
  //       rowData[headers[index]] = cell;
  //     });
  //     return rowData;
  //   });
  //   console.log("Logging", JSON.stringify(tableData[0]));

  //   const res = await fetch("../api/new-order", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       orderRefId,
  //       data: tableData[0],
  //       userId: (session?.user as any)?.id,
  //     }),
  //   });

  //   if (res.ok) {
  //     window.location.reload();
  //   }
  // };

  const submitTable = async () => {
    const tableData = table.map((row) => {
      const rowData: { [key: string]: any } = {};
      row.forEach((cell, index) => {
        rowData[headers[index]] = cell;
      });
      return rowData;
    });

    const res = await fetch("/api/new-order", {
      method: "POST",
      body: JSON.stringify({
        referenceId: orderRefId, // @REMEMBER, had to change this to the referenceID field, as accepted by the /new-order/route.ts file
        data: tableData, // pass the entire tableData array to create multiple order items
        userId: (session?.user as any)?.id,
      }),
    });

    if (res.ok) {
      window.location.reload();
      // console.log(res.body);
    }
  };

  return (
    <div className="p-8 pb-5 mb-5 m-8 space-y-4 bg-white text-black rounded-lg shadow-2xl">
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2 px-1 py-2"
          htmlFor="orderRefId"
        >
          Order #RID
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="orderRefId"
          type="text"
          placeholder="Enter this Order's Reference ID (you can still assign each item an ID)"
          value={orderRefId}
          onChange={(e) => setOrderRefId(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <button
          className="bg-nova text-white px-4 py-2 rounded hover:bg-nova-dark outline outline-1 outline-black"
          onClick={addColumn}
        >
          Add Attribute (Col)
        </button>
        <button
          className="bg-nova text-white px-4 py-2 rounded hover:bg-nova-dark outline outline-1 outline-black"
          onClick={addRow}
        >
          Add Element (Row)
        </button>
      </div>
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="bg-black text-white">
            {headers.map((header, index) => (
              <th key={index} className="border border-gray-200 px-4 py-2">
                <div className="flex  justify-between">
                  <input
                    className="border-0 bg-transparent focus:outline-none w-full text-white"
                    value={header}
                    onChange={(e) => {
                      if (
                        header !== "Item ID" &&
                        header !== "Need Date" &&
                        index !== headers.length - 1
                      ) {
                        const newHeaders = [...headers];
                        newHeaders[index] = e.target.value;
                        setHeaders(newHeaders);
                      }
                    }}
                  />
                  {header !== "Item ID" &&
                    header !== "Need Date" &&
                    index !== headers.length - 1 && (
                      <button
                        onClick={() => deleteColumn(index)}
                        className="bg-gray-800 hover:text-red-700 outline outline-1 hover:outline-white outline-gray-600 text-gray-200 rounded-sm m-1 p-1"
                      >
                        <XIcon className="h-3 w-5" />
                      </button>
                    )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, rowIndex) => (
            <tr key={rowIndex} className="border border-gray-200">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-200 px-4 py-2"
                >
                  {cellIndex === headers.length - 1 ? ( // If this is the last column, render a dropdown for vendor selection
                    <div>
                      <div className="relative">
                        <select
                          className="appearance-none bg-nova text-white px-4 py-2 pr-8 rounded hover:bg-nova-dark outline-none w-full"
                          value=""
                          onChange={(e) => {
                            const newTable = [...table];
                            const selectedVendor = e.target.value;
                            if (
                              !newTable[rowIndex][cellIndex].includes(
                                selectedVendor
                              )
                            ) {
                              newTable[rowIndex][cellIndex] = [
                                ...newTable[rowIndex][cellIndex],
                                selectedVendor,
                              ];
                              setTable(newTable);
                            }
                          }}
                        >
                          <option value="">Select</option>
                          {(vendors != undefined || vendors != null) &&
                            vendors.map((vendor) => (
                              <option
                                key={vendor.id}
                                value={vendor.id}
                                disabled={cell.includes(vendor.id)}
                              >
                                {vendor.name}
                              </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5.454 6.321l4.546 4.679 4.546-4.679-1.818-1.867-2.728 2.823-2.728-2.823z" />
                          </svg>
                        </div>
                      </div>
                      {Array.isArray(cell) &&
                        cell.map((vendorId) => {
                          const vendor = vendors.find((v) => v.id === vendorId);
                          return (
                            <div
                              key={vendorId}
                              className="flex items-center space-x-2 m-1 p-1 bg-gray-200 rounded outline-gray-300 outline justify-between"
                            >
                              <span>{vendor?.name}</span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newTable = [...table];
                                  newTable[rowIndex][cellIndex] = newTable[
                                    rowIndex
                                  ][cellIndex].filter(
                                    (id: any) => id !== vendorId
                                  );
                                  setTable(newTable);
                                }}
                                className="bg-gray-300 hover:text-red-700 outline outline-1 hover:outline-black text-gray-800 rounded-sm m-1 p-1 outline-gray-400"
                              >
                                <XIcon className="h-3 w-5" />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <input
                      className="border-0 bg-transparent focus:outline-none w-full"
                      value={cell}
                      onChange={(e) => {
                        const newTable = [...table];
                        newTable[rowIndex][cellIndex] = e.target.value;
                        setTable(newTable);
                      }}
                    />
                  )}
                </td>
              ))}

              <td className="">
                <button
                  onClick={() => deleteRow(rowIndex)}
                  className="bg-gray-200 hover:text-red-700 outline outline-1 hover:outline-black text-gray-800 rounded-sm m-1 p-1 outline-gray-400"
                >
                  <XIcon className="h-3 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-nova text-white px-4 py-2 rounded mt-4 hover:bg-nova-dark outline outline-1 outline-black"
        // @TODO: test
        onClick={submitTable}
      >
        Submit
      </button>
    </div>
  );
};

export default TableComponent;
