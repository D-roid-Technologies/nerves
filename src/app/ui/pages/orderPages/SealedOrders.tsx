import React from "react";
import OrderList from "./OrderList";
import { mockOrders } from "./mockOrders";

const SealedOrders: React.FC = () => {
  const sealedOrders = mockOrders.filter((order) => order.status === "sealed");

  return (
    <OrderList
      title="Sealed Orders"
      description="Orders that have been packaged and sealed"
      orders={sealedOrders}
      showStatus={true}
    />
  );
};

export default SealedOrders;
