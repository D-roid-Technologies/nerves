import React from "react";
import OrderList from "./OrderList";
import { mockOrders } from "./mockOrders";

const ViewAllOrders: React.FC = () => {
  return (
    <OrderList
      title="All Orders"
      description="View all your orders in one place"
      orders={mockOrders}
      showStatus={true}
    />
  );
};
export default ViewAllOrders;