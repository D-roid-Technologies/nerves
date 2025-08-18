import React from "react";
import { ArrowLeft, ImageIcon, Package } from "lucide-react";
import styles from "./order.module.css";
import { useNavigate } from "react-router-dom";

interface OrderListProps {
  title: string;
  description: string;
  orders: any[];
  showStatus?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({
  title,
  description,
  orders,
  showStatus = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles["order-list-container"]}>
      <button className={styles["order-back-btn"]} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className={styles["order-header"]}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {orders.length > 0 ? (
        <div>
          {orders.map((order) => (
            <div key={order.id} className={styles["order-card"]}>
              <div className={styles["order-card-header"]}>
                <div>
                  <div className={styles["order-card-id"]}>
                    Order #{order.id}
                  </div>
                  <div className={styles["order-card-date"]}>{order.date}</div>
                </div>
                {showStatus && (
                  <span
                    className={`${styles["order-card-status"]} ${
                      styles[`status-${order.status}`]
                    }`}
                  >
                    {order.status}
                  </span>
                )}
              </div>

              <div className={styles["order-card-items"]}>
                {order.items.map((item: any, index: number) => (
                  <div key={index} className={styles["order-item"]}>
                    <div className={styles["order-item-image"]}>
                      <ImageIcon size={24} color="#9ca3af" />
                    </div>
                    <div className={styles["order-item-details"]}>
                      <div className={styles["order-item-name"]}>
                        {item.name}
                      </div>
                      <div className={styles["order-item-price"]}>
                        {item.price}
                      </div>
                    </div>
                    <div className={styles["order-item-quantity"]}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles["order-card-footer"]}>
                <div className={styles["order-total"]}>
                  Total: {order.total}
                </div>
                <div className={styles["order-payment-method"]}>
                  Paid with {order.paymentMethod}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles["order-empty-state"]}>
          <Package className={styles["order-empty-icon"]} />
          <p>No {title.toLowerCase()} orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrderList;
