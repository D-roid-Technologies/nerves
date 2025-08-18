import React from "react";
import OrderList from "./OrderList";
import { mockOrders } from "./mockOrders";

const DispatchedOrders: React.FC = () => {
  const dispatchedOrders = mockOrders.filter(
    (order) => order.status === "dispatched"
  );

  return (
    <OrderList
      title="Dispatched Orders"
      description="Orders that have been shipped"
      orders={dispatchedOrders}
      showStatus={false}
    />
  );
};

export default DispatchedOrders;
