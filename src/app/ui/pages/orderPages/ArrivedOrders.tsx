import React from "react";
import OrderList from "./OrderList";
import { mockOrders } from "./mockOrders";

const ArrivedOrders: React.FC = () => {
  const arrivedOrders = mockOrders.filter(
    (order) => order.status === "arrived"
  );

  return (
    <OrderList
      title="Arrived Orders"
      description="Orders that have arrived at their destination"
      orders={arrivedOrders}
      showStatus={true}
    />
  );
};

export default ArrivedOrders;
