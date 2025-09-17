import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import OrderList from "./OrderList";

const ViewAllOrders: React.FC = () => {
  const paidOrders = useSelector((state: RootState) => state.paidOrders);

  return (
    <OrderList
      title="All Orders"
      // description="View all your orders in one place"
      orders={paidOrders.orders}
      showStatus={true}
    />
  );
};

export default ViewAllOrders;
