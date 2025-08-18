import React from "react";
import styles from "../account/account.module.css";

interface OrderStatusProps {
  label: string;
  count: number;
  Icon: React.ElementType;
  onClick?: () => void;
  status?:
    | "paid"
    | "sealed"
    | "dispatched"
    | "arrived"
    | "confirmed"
    | "returned"
    | "reviewed";
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  label,
  count,
  Icon,
  onClick,
  status,
}) => {
  // Get status-specific styling
  const getStatusStyle = () => {
    if (!status) return "";

    switch (status) {
      case "paid":
        return styles["status-paid"];
      case "sealed":
        return styles["status-sealed"];
      case "dispatched":
        return styles["status-dispatched"];
      case "arrived":
        return styles["status-arrived"];
      case "confirmed":
        return styles["status-confirmed"];
      case "returned":
        return styles["status-returned"];
      case "reviewed":
        return styles["status-reviewed"];
      default:
        return "";
    }
  };

  return (
    <div
      className={`${styles["account-order-status"]} ${getStatusStyle()}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className={styles["account-order-status-icon-container"]}>
        <Icon className={styles["account-order-status-icon"]} size={20} />
      </div>
      <div className={styles["account-order-status-text"]}>
        <span className={styles["account-order-status-label"]}>{label}</span>
        <span className={styles["account-order-status-count"]}>
          {count} {count === 1 ? "order" : "orders"}
        </span>
      </div>
    </div>
  );
};

export default OrderStatus;
