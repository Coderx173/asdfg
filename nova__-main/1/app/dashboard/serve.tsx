"use client";
import { useRecoilState } from "recoil";
import { selectedState } from "../state/atoms/selectedState";
import TableComponent from "../components/tableComponent";
import { VendorStatus } from "@prisma/client";
import { GetResult } from "@prisma/client/runtime";
import VendorComponent from "../components/VendorComponent";
import OrderStatusPage from "../components/orderView";

const Serve = () => {
  const [state, setState] = useRecoilState(selectedState);
  return (
    <div>
      {(state === "New Order" && <TableComponent />) ||
        (state === "Vendors" && <VendorComponent />) ||
        (state === "Status" && <OrderStatusPage />)}
    </div>
  );
};

export default Serve;
