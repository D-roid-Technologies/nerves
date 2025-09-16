import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import OrderList from "./OrderList";

const PaidOrders: React.FC = () => {
  const paidOrders = useSelector((state: RootState) => state.paidOrders);
  const paidOrdersFiltered = paidOrders.orders.filter(
    (order) => order.status === "paid"
  );

  return (
    <OrderList
      title="Paid Orders"
      // description="Orders that have been successfully paid for"
      orders={paidOrdersFiltered}
      showStatus={true}
    />
  );
};

export default PaidOrders;
