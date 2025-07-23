import React from "react";
import {
  Star,
  CheckCircle,
  Truck,
  Package,
  RefreshCcw,
  MessageSquare,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from "./account.module.css";

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  orders: {
    paid: 5,
    sealed: 3,
    dispatched: 2,
    arrived: 2,
    confirmed: 1,
    returned: 0,
    reviewed: 4,
  },
  reviews: [
    {
      id: 1,
      item: "Wireless Headphones",
      rating: 4,
      comment: "Great sound quality!",
    },
    {
      id: 2,
      item: "Bluetooth Speaker",
      rating: 5,
      comment: "Excellent bass and clarity.",
    },
  ],
  sales: [
    {
      id: 1,
      item: "Used iPhone 12",
      status: "Sold",
    },
    {
      id: 2,
      item: "Gaming Laptop",
      status: "Sold",
    },
  ],
};

interface OrderStatusProps {
  label: string;
  count: number;
  Icon: React.ElementType;
}

export default function MyAccountPage() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className={styles["account-container"]}>
      <h1 className={styles["account-h1"]}>My Account</h1>

      <div className={styles["account-section"]}>
        <div className={styles["account-profile-header"]}>
          <h2 className={styles["account-h2"]}>Profile Information</h2>
          <button className={styles["account-edit-btn"]}>Edit Profile</button>
        </div>
        <div className={styles["account-profile-details"]}>
          <p>
            {user.firstName} {user.lastName}
          </p>
          <p>{user.email}</p>
        </div>
      </div>

      <div className={styles["account-section"]}>
        <h2 className={styles["account-h2"]}>Orders Overview</h2>
        <div className={styles["account-orders-grid"]}>
          <OrderStatus
            label="Paid"
            count={mockUser.orders.paid}
            Icon={CheckCircle}
          />
          <OrderStatus
            label="Sealed"
            count={mockUser.orders.sealed}
            Icon={Package}
          />
          <OrderStatus
            label="Dispatched"
            count={mockUser.orders.dispatched}
            Icon={Truck}
          />
          <OrderStatus
            label="Arrived"
            count={mockUser.orders.arrived}
            Icon={CheckCircle}
          />
          <OrderStatus
            label="Confirmed"
            count={mockUser.orders.confirmed}
            Icon={CheckCircle}
          />
          <OrderStatus
            label="Returned"
            count={mockUser.orders.returned}
            Icon={RefreshCcw}
          />
          <OrderStatus
            label="Reviewed"
            count={mockUser.orders.reviewed}
            Icon={MessageSquare}
          />
        </div>
      </div>

      <div className={styles["account-section"]}>
        <h2 className={styles["account-h2"]}>My Reviews</h2>
        {mockUser.reviews.length > 0 ? (
          <div className={styles["account-list"]}>
            {mockUser.reviews.map((review) => (
              <div
                key={review.id}
                className={`${styles["account-list-item"]} ${styles["account-review-item"]}`}
              >
                <h3 className={styles["account-review-title"]}>
                  {review.item}
                </h3>
                <div className={styles["account-review-stars"]}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className={styles["account-review-star"]} />
                  ))}
                </div>
                <p className={styles["account-review-comment"]}>
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles["account-empty-state"]}>No reviews yet.</p>
        )}
      </div>

      <div className={styles["account-section"]}>
        <h2 className={styles["account-h2"]}>My Sales</h2>
        {mockUser.sales.length > 0 ? (
          <div className={styles["account-list"]}>
            {mockUser.sales.map((sale) => (
              <div
                key={sale.id}
                className={`${styles["account-list-item"]} ${styles["account-sale-item"]}`}
              >
                <span>{sale.item}</span>
                <span className={styles["account-sale-status"]}>
                  {sale.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles["account-empty-state"]}>No items sold yet.</p>
        )}
      </div>
    </div>
  );
}

function OrderStatus({ label, count, Icon }: OrderStatusProps) {
  return (
    <div className={styles["account-order-status"]}>
      <Icon className={styles["account-order-status-icon"]} />
      <div className={styles["account-order-status-text"]}>
        <span className={styles["account-order-status-label"]}>{label}</span>
        <span className={styles["account-order-status-count"]}>{count}</span>
      </div>
    </div>
  );
}
