import React from "react";
import OrderList from "./OrderList";
import { mockOrders } from "./mockOrders";

const PaidOrders: React.FC = () => {
  const paidOrders = mockOrders.filter((order) => order.status === "paid");

  return (
    <OrderList
      title="Paid Orders"
      description="Orders that have been successfully paid for"
      orders={paidOrders}
      showStatus={true}
    />
  );
};

export default PaidOrders;
