const session: any = {}


const createProcurementEmailForVendor = (
    vendorName: string,
    orderId: string, 
    orderItemData: any, // parse out invalid information (ie. vendors to contact...)
    me: string
  ) => {
    // Extracting keys from the orderItem's data to dynamically generate the email content
    const dataKeys = Object.keys(orderItemData);

    // Check if session and user data is available
    // const userName =
    //   session && session.user ? session.user.name : "Unknown User";

    // Subject
    const subject = `Procurement Request by ${me} for Order ID: ${orderId}`;

    // Text
    const text = `
  Dear ${vendorName},
  
  We would like to request the following items:
  
  Order ID: ${orderId}
  ${dataKeys.map((key) => `${key}: ${orderItemData[key]}`).join("\n")}
  
  Please confirm the availability, delivery details, and pricing at the earliest.
  
  Thank you,
  ${me}
  `;

    // HTML
    const html = `
  <html>
  <head>
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body>
    <p>Dear ${vendorName},</p>
    <p>We would like to request the following items:</p>
    <table>
      <thead>
        ${dataKeys.map((key) => `<th>${key}</th>`).join("")}
      </thead>
      <tbody>
        <tr>
          ${dataKeys.map((key) => `<td>${orderItemData[key]}</td>`).join("")}
        </tr>
      </tbody>
    </table>
    <p>Please confirm the availability, delivery details, and pricing at the earliest.</p>
    <p>Thank you,</p>
    <p>${me}</p>
  </body>
  </html>
  `;

    return [subject, text, html];
  };