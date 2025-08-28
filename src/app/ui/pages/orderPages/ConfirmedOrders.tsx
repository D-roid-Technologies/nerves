import React from "react";
import OrderList from "./OrderList";
import { mockOrders } from "./mockOrders";

const ConfirmedOrders: React.FC = () => {
  const confirmedOrders = mockOrders.filter(
    (order) => order.status === "confirmed"
  );

  return (
    <OrderList
      title="Confirmed Orders"
      description="Orders that have been received and confirmed"
      orders={confirmedOrders}
      showStatus={true}
    />
  );
};

export default ConfirmedOrders;
