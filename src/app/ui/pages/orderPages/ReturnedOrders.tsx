import React from "react";
import OrderList from "./OrderList";
import { mockOrders } from "./mockOrders";

const ReturnedOrders: React.FC = () => {
  const returnedOrders = mockOrders.filter(
    (order) => order.status === "returned"
  );

  return (
    <OrderList
      title="Returned Orders"
      description="Orders that have been returned"
      orders={returnedOrders}
      showStatus={true}
    />
  );
};

export default ReturnedOrders;
