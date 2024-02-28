"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CompiledEmail {
  vendorId: string;
  name: string;
  email: string;
  subject: string;
  text: string;
  html: string;
}

interface IndividualEmailData {
  vendorId: string;
  email: string;
  name: string;
  orders: IndividualOrder[];
}

interface IndividualOrder {
  orderData: JSON;
  orderId: string;
  orderItemData: OrderItemData;
}

interface OrderItemData {
  data: any; // @TODO: fixable...
  id: string;
  orderId: String;
}

const OrderStatusPage = () => {
  const { data: session } = useSession();

  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [counter, setCounter] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentEmailChain, setCurrentEmailChain] = useState<any | null>(null);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const handleBackClick = () => {
    setSelectedOrder(null);
  };

  const getVendorNameById = (id: string) => {
    const vendor: any = vendors.find((v: any) => v.id === id);
    return vendor ? vendor.name : "Unknown Vendor";
  };

  const getVendorEmailById = (id: string) => {
    const vendor: any = vendors.find((v: any) => v.id === id);
    return vendor ? vendor.email : "Unknown Vendor";
  };

  // @TODO: button handler requirements
  const generateEmailChain = async (orderId: string) => {
    const response = await fetch("/api/emailchain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    // Check if the email was sent successfully
    if (response.ok) {
      const result = await response.json();
      console.log(result.message); // You can handle the success message as needed
      return result.id; // @REMEMBER... this will return an object with an id...
    } else {
      const error = await response.json();
      console.error(error.error); // You can handle the error message as needed
      return 0;
    }
  };

  const EmailChainModal = ({ emailChain, onClose }: any) => {
    const emailDetails = [...emailChain.emailChain.emails];

    const getFormattedDate = (timestamp: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(timestamp).toLocaleDateString(undefined, options);
    };

    const groupEmailsByParentId = (emails: any[]) => {
      const groupedEmails: { [key: string]: any[] } = {};

      emails.forEach((email) => {
        const groupId = email.parentId || email.id; // group by parentId or if it's the original email, use its own id
        if (!groupedEmails[groupId]) {
          groupedEmails[groupId] = [];
        }
        groupedEmails[groupId].push(email);
      });

      return groupedEmails;
    };

    const emailGroups = groupEmailsByParentId(emailDetails);

    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-3/4">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Email Chain
              </h3>
              <div className="overflow-x-auto">
                {" "}
                {/* Added this for horizontal scrolling */}
                <div className="flex flex-row space-x-4">
                  {Object.values(emailGroups).map((group: any, idx: number) => (
                    <ul key={idx} className="border-r-2 pr-4">
                      {group.map((email: any) => (
                        <li key={email.id} className="border-b-2 py-2">
                          <strong>Subject:</strong> {email.subject} <br />
                          <strong>From:</strong>{" "}
                          {getVendorNameById(email.vendorId)} -{" "}
                          {getVendorEmailById(email.vendorId)} <br />
                          <strong>Date:</strong>{" "}
                          {getFormattedDate(email.timestamp)} <br />
                          <strong>Body:</strong> <br /> {email.textBody}
                          {email.parentId && (
                            <div>
                              <strong>Re: </strong>
                              {email.parentId}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const generateEmail = async (
    emailChainId: string,
    vendorId: string,
    userId: string,
    subject: string,
    textBody: string,
    htmlBody: string
  ) => {
    const response = await fetch("/api/new-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailChainId,
        vendorId,
        userId,
        subject,
        textBody,
        htmlBody,
      }),
    });

    // Check if the email was sent successfully
    if (response.ok) {
      const result = await response.json();
      console.log("SUCCESS: ", result); // You can handle the success message as needed
      return result;
    } else {
      const error = await response.json();
      console.log("ERROR: ", error); // You can handle the error message as needed
      return 0;
    }
  };

  const transformVendorDetailsToOrderData = (
    vendorDetailsMap: any,
    orders: any[]
  ) => {
    const transformedMap: {
      [id: string]: { name: string; email: string; orders: any[] };
    } = {};

    // Helper function to get order data by orderItemId
    const getOrderDataByOrderItemId = (orderItemId: string) => {
      for (const order of orders) {
        const foundOrderItem = order.orderItems.find(
          (item: any) => item.id === orderItemId
        );
        if (foundOrderItem) {
          return {
            orderId: order.id,
            orderData: order,
            orderItemData: foundOrderItem,
          };
        }
      }
      return null;
    };

    // Iterate over the vendorDetailsMap
    for (const [orderItemId, vendorDetails] of Object.entries(
      vendorDetailsMap
    )) {
      for (const [vendorID, vendorInfo] of Object.entries(
        vendorDetails as any
      )) {
        // If the vendorID is not already a key in the transformedMap, add it
        if (!transformedMap[vendorID]) {
          transformedMap[vendorID] = {
            name: (vendorInfo as any).name,
            email: (vendorInfo as any).email,
            orders: [],
          };
        }
        // Get the order data associated with the orderItemId
        const orderData = getOrderDataByOrderItemId(orderItemId);
        if (orderData) {
          transformedMap[vendorID].orders.push(orderData);
        }
      }
    }

    return transformedMap;
  };

  // Your initialization of vendorDetailsMap remains unchanged.

  // send emails...
  function removeVendorsField(vendorData_: any) {
    const vendorData = JSON.parse(JSON.stringify(vendorData_));

    // Iterate through orders
    vendorData.orders.forEach(
      (order: {
        orderData: { orderItems: any[] };
        orderItemData: { data: { Vendors: any } };
      }) => {
        // Check and remove Vendors from orderData if exists
        if (order.orderData && order.orderData.orderItems) {
          order.orderData.orderItems.forEach(
            (item: { data: { Vendors: any } }) => {
              if (item.data && item.data.Vendors) {
                delete item.data.Vendors;
              }
            }
          );
        }

        // Check and remove Vendors from orderItemData if exists
        if (
          order.orderItemData &&
          order.orderItemData.data &&
          order.orderItemData.data.Vendors
        ) {
          delete order.orderItemData.data.Vendors;
        }
      }
    );

    return vendorData;
  }

  const handleContactVendors = async (order: any) => {
    // Create a map to store vendor name-email pairs for each orderItem ID
    const vendorDetailsMap: { [key: string]: { [name: string]: string } } = {};

    // Iterate over order items of the passed order
    order.orderItems.forEach((orderItem: any) => {
      // Check if the order item has vendors associated with it
      if (orderItem.data.Vendors && orderItem.data.Vendors.connect) {
        // Create an object to store the current order item's vendor details
        const currentVendorDetails: any = {};

        // Iterate over the vendor objects of the current order item
        orderItem.data.Vendors.connect.forEach((vendorObj: any) => {
          // Get the name and email of the vendor using its ID
          const vendorName = getVendorNameById(vendorObj.id);
          const vendorEmail = getVendorEmailById(vendorObj.id);
          if (vendorEmail !== "Unknown Vendor") {
            currentVendorDetails[vendorObj.id] = {
              email: vendorEmail,
              name: vendorName,
              id: vendorObj.id,
            };
          }
        });
        // console.log("VENDOR DETAILS", currentVendorDetails);
        // Add the current order item's vendor details to the vendorDetailsMap
        vendorDetailsMap[orderItem.id] = currentVendorDetails;
      }
    });

    const createEmail = (x: IndividualEmailData): CompiledEmail => {
      // Extracting user name from session
      const userName = (session as any).user.name;

      // Creating the subject
      const subject = `Procurement Request - ${userName} - ID: ${x.orders[0].orderId}`;

      // Start of the HTML content with professional styling
      let htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; max-width: 600px;">
        <p>Dear ${x.name},</p>
        <p>I hope this email finds you well. We are reaching out to inquire about the availability, pricing, and shipping details of certain materials.</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f5f5f5;">`;

      // Assuming the data property in OrderItemData is a JSON object and all orders have the same keys
      const orderItemDataKeys = Object.keys(x.orders[0].orderItemData.data);
      orderItemDataKeys.forEach((key) => {
        htmlContent += `<th style="padding: 10px; border: 1px solid #e0e0e0;">${key}</th>`;
      });

      htmlContent += `</tr></thead><tbody>`;

      // Iterate over each order to generate table rows
      x.orders.forEach((order) => {
        htmlContent += `<tr>`;
        orderItemDataKeys.forEach((key) => {
          htmlContent += `<td style="padding: 10px; border: 1px solid #e0e0e0;">${order.orderItemData.data[key]}</td>`;
        });
        htmlContent += `</tr>`;
      });

      htmlContent += `</tbody></table>`;
      htmlContent += `<p>Could you please provide information on the availability, pricing, and shipping details for these materials?</p>`;
      htmlContent += `<p>Thank you for your assistance.</p>`;
      htmlContent += `<p>Best regards,</p>`;
      htmlContent += `<p>${userName}</p>`;
      htmlContent += `<br><br><p>Order ID: ${x.orders[0].orderId}</p>
      </div>`;

      // Start of the text content
      let textContent = `Dear ${x.name},\n\n`;
      textContent += `I hope this email finds you well. We are reaching out to inquire about the availability, pricing, and shipping details of certain materials.\n\n`;

      // Iterate over each order to generate text content
      x.orders.forEach((order) => {
        orderItemDataKeys.forEach((key) => {
          textContent += `${key}: ${order.orderItemData.data[key]}\n`;
        });
        textContent += `\n`;
      });

      textContent += `Could you please provide information on the availability, pricing, and shipping details for these materials?\n\n`;
      textContent += `Thank you for your assistance.\n\n`;
      textContent += `Best regards,\n`;
      textContent += `${userName}`;

      return {
        vendorId: x.vendorId,
        name: x.name,
        email: x.email,
        subject: subject,
        text: textContent,
        html: htmlContent,
      };
    };

    // Now, you have a map of orderItem IDs to vendor name-email pairs for the selected order.
    // console.log("Vendor Details Map for Selected Order:", vendorDetailsMap);
    const transformedVendorMap = transformVendorDetailsToOrderData(
      vendorDetailsMap,
      orders
    );

    // Iterate over the transformedMap to generate emails for each vendor
    let vendorDataArray: any = [];
    for (const [vendorId, vendorData] of Object.entries(
      transformedVendorMap as any
    )) {
      // Remove the "Vendors" attribute from each order data
      (vendorData as any).orders.forEach((order: any) => {
        delete order.orderData.Vendors;
      });

      // const emailData = generateEmailForVendor(
      //   vendorData,
      //   (vendorData as any).orders
      // );
      // emailsForVendors.push(emailData);
      const add = removeVendorsField(vendorData);
      add["vendorId"] = vendorId;
      vendorDataArray.push(add);
    }

    console.log("ROAD", vendorDataArray);

    const x: IndividualEmailData[] = vendorDataArray;

    let compiledEmails: CompiledEmail[] = [];

    for (let i = 0; i < x.length; i++) {
      compiledEmails.push(createEmail(x[i]));
    }

    const emailChainId: string = await generateEmailChain(
      x[0].orders[0].orderId
    );

    const orderId: string = x[0].orders[0].orderId;

    console.log("EMAIL CHAIN ID: ", emailChainId);
    console.log("VENDOR-DETAILS | ", x[0].orders[0].orderId);
    console.log("VENDORS | ", vendors);
    // console.log("Compiled Emails | ", compiledEmails);

    // sendCompiledEmails(compiledEmails)
    console.log("ABC ", (session as any).user.id);

    const sent: boolean[] = await sendCompiledEmails(
      compiledEmails,
      [],
      emailChainId,
      orderId
    );

    console.log(sent);
    let updateStatus: boolean = true;
    for (let b of sent) {
      if (!b) {
        updateStatus = false;
        console.log("FAILED 123");
        break;
      }
    }
    if (updateStatus) {
      const status = "CONTACTED_VENDORS"; // or any status you want to set

      // Make a request to the API route to update the order status
      const response: Response = await fetch("/api/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (response.ok) {
        console.log("SUCCESS $123", JSON.stringify(response.json()));
        // setState((state + 1) % 10000000);
        // forceRender((prevCount) => prevCount + 1);
        setCounter((counter + 1) % 1000000);
      } else {
        console.log("FAILED $123", JSON.stringify(response.json()));
      }
    }
    // iterate over sent and assign information identification.

    // 🙏🙏🙏🙏🙏🙏🙏🙏 thank god.
    // const emailsForVendors: any = createEmailTemplates(vendorDataArray);
    // console.log(emailsForVendors);
    // 🙏🙏🙏🙏🙏🙏🙏🙏 thank god.
  };

  const handleViewInbox = async (order: any) => {
    const orderId = (order as any).id;

    const emailChain: Response = await (
      await fetch("/api/get-emailchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })
    ).json();

    console.log("barbarian ", currentEmailChain, showModal);
    setCurrentEmailChain(emailChain);
    setShowModal(true);
    console.log("barbarian ", currentEmailChain, showModal);
  };

  const sendCompiledEmails = async (
    compiledEmails: CompiledEmail[],
    sent: boolean[],
    emailChainId: string,
    order_id: string
  ) => {
    for (let email of compiledEmails) {
      // Call the sendEmail function with the appropriate parameters
      sendEmail(email.email, email.subject, email.text, email.html, order_id, email.vendorId) // replace email.email with a rando email to test legitness...
        .then(async () => {
          console.log(`Email sent succesfully to: ${email.email}`);
          sent.push(true);
          await generateEmail(
            emailChainId,
            email.vendorId,
            (session as any).user.id,
            email.subject,
            email.text,
            email.html
          );
        })
        .catch((e) => {
          console.log(`Error: ${e}, Email: ${email.email}`);
          sent.push(false);
        });
    }
    return sent;
  };

  async function sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
    order_id: string,
    vendor_id: string
  ) {
    try {
      // Define the URL for the send-email route
      const sendEmailURL = "/api/send-email"; // Adjust this if your route's path is different

      // Make a POST request to the send-email route
      const response = await fetch(sendEmailURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, text, html, order_id, vendor_id, cc: null }),
      });

      // Check if the email was sent successfully
      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // You can handle the success message as needed
      } else {
        const error = await response.json();
        console.error(error.error); // You can handle the error message as needed
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  useEffect(() => {
    if (session)
      // Fetch vendors
      fetch("/api/get-vendors", {
        // <-- Corrected endpoint
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
        .catch((error) => console.error(error));
  }, [session]);

  useEffect(() => {
    if (session)
      fetch("/api/get-orders", {
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
          console.log("REACHED 🎅🏻🎄");
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setOrders(data.orders);
        })
        .catch((error) => console.error(error));
  }, [session, counter]);

  if (selectedOrder) {
    // Extract keys from the first item in the orderItems array
    const tableHeaders = Object.keys((selectedOrder as any).orderItems[0].data);

    return (
      <div className="p-8 pb-5 mb-5 m-8 space-y-4 bg-white text-black rounded-lg shadow-2xl">
        <button
          onClick={handleBackClick}
          className="bg-nova text-white px-4 py-2 rounded hover:bg-nova-dark outline outline-1 outline-black"
        >
          Back
        </button>
        <table className="table-auto border-collapse w-full mt-4">
          <thead>
            <tr className="bg-black text-white">
              {tableHeaders.map((header) => (
                <th key={header} className="border border-gray-200 px-4 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(selectedOrder as any).orderItems.map((orderItem: any) => (
              <tr key={orderItem.id} className="border border-gray-200">
                {tableHeaders.map((header) => (
                  <td key={header} className="border border-gray-200 px-4 py-2">
                    {header === "Vendors" &&
                    typeof orderItem.data[header] === "object" &&
                    orderItem.data[header].connect
                      ? orderItem.data[header].connect
                          .map((vendorObj: any) =>
                            getVendorNameById(vendorObj.id)
                          )
                          .join(", ")
                      : orderItem.data[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-8 pb-5 mb-5 m-8 space-y-4 bg-white text-black rounded-lg shadow-2xl">
      {showModal && (
        <EmailChainModal
          emailChain={currentEmailChain}
          onClose={() => setShowModal(false)}
        />
      )}
      <table className="table-auto border-collapse w-full mt-4">
        <thead>
          <tr className="bg-black text-white">
            <th className="border border-gray-200 px-4 py-2">
              Order ID (click for more info)
            </th>
            <th className="border border-gray-200 px-4 py-2">Date Requested</th>
            <th className="border border-gray-200 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id}>
              <td
                className="border border-gray-200 px-4 py-2 hover:bg-gray-300 hover:outline-gray-400 hover:outline cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                <span>
                  {order.referenceId === "" ? order.id : order.referenceId}
                </span>
                {/* <button
                className="cursor-pointer"
                className="bg-gray-300 text-black p-0.5 rounded hover:bg-gray-400 outline outline-1 outline-gray-400"
              >
                info
              </button> */}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {formatDate(order.dateRequested)}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {order.status}
              </td>
              <td className="pl-4">
                {(() => {
                  switch (order.status) {
                    case "PENDING":
                      return (
                        <button
                          onClick={() => handleContactVendors(order)}
                          className="bg-nova text-white w-40 text-center px-4 py-2 p-1 m-1 rounded hover:bg-nova-dark outline outline-1 outline-black"
                        >
                          Contact Vendors
                        </button>
                      );
                    case "CONTACTED_VENDORS":
                      return (
                        <button
                          onClick={() => {
                            console.log("clicked CONTACTED_VENDORS");
                            handleViewInbox(order);
                          }}
                          className="bg-yellow-400 text-white w-40 text-center px-4 py-2 p-1 m-1 rounded hover:bg-nova-dark outline outline-1 outline-black"
                        >
                          View Inbox
                        </button>
                      );
                    case "FULFILLED":
                      return (
                        <button
                          onClick={(e) => console.log(order.status)}
                          className="bg-green-500 text-white px-4 py-2 p-1 m-1 rounded hover:bg-nova-dark outline outline-1 outline-black"
                        >
                          View Inbox
                        </button>
                      );
                    case "CANCELLED":
                      return (
                        <button
                          onClick={(e) => console.log(order.status)}
                          className="bg-red-500 text-white px-4 py-2 p-1 m-1 rounded hover:bg-nova-dark outline outline-1 outline-black"
                        >
                          Reorder
                        </button>
                      );
                    default:
                      return null;
                  }
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderStatusPage;
