import React from "react";
import OrderList from "./OrderList";
import { mockOrders } from "./mockOrders";

const ReviewedOrders: React.FC = () => {
  const reviewedOrders = mockOrders.filter(
    (order) => order.status === "reviewed"
  );

  return (
    <OrderList
      title="Reviewed Orders"
      description="Orders that have been reviewed"
      orders={reviewedOrders}
      showStatus={true}
    />
  );
};

export default ReviewedOrders;
    