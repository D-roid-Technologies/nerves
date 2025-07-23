import React from "react";
import {
  Star,
  CheckCircle,
  Truck,
  Package,
  RefreshCcw,
  MessageSquare,
  Edit,
  Image as ImageIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from "./account.module.css";

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "January 2023",
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
      comment:
        "Great sound quality! The battery life is impressive and they're very comfortable for long listening sessions.",
      date: "2 weeks ago",
    },
    {
      id: 2,
      item: "Bluetooth Speaker",
      rating: 5,
      comment: "Excellent bass and clarity. Perfect for outdoor gatherings.",
      date: "1 month ago",
    },
  ],
  sales: [
    {
      id: 1,
      item: "Used iPhone 12",
      status: "Sold",
      price: "$450",
    },
    {
      id: 2,
      item: "Gaming Laptop",
      status: "Sold",
      price: "$1200",
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
          <button className={styles["account-edit-btn"]}>
            <Edit size={16} style={{ marginRight: "8px" }} />
            Edit Profile
          </button>
        </div>
        <div className={styles["account-profile-details"]}>
          <div className={styles["account-profile-detail"]}>
            <span className={styles["account-detail-label"]}>Name</span>
            <span className={styles["account-detail-value"]}>
              {user.firstName} {user.lastName}
            </span>
          </div>
          <div className={styles["account-profile-detail"]}>
            <span className={styles["account-detail-label"]}>Email</span>
            <span className={styles["account-detail-value"]}>{user.email}</span>
          </div>
          <div className={styles["account-profile-detail"]}>
            <span className={styles["account-detail-label"]}>Phone</span>
            <span className={styles["account-detail-value"]}>
              {mockUser.phone}
            </span>
          </div>
          <div className={styles["account-profile-detail"]}>
            <span className={styles["account-detail-label"]}>Member Since</span>
            <span className={styles["account-detail-value"]}>
              {mockUser.joinDate}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["account-section"]}>
        <h2 className={styles["account-h2"]}>Order Status</h2>
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
                <div className={styles["account-review-header"]}>
                  <h3 className={styles["account-review-title"]}>
                    {review.item}
                  </h3>
                  <span className={styles["account-review-date"]}>
                    {review.date}
                  </span>
                </div>
                <div className={styles["account-review-stars"]}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={styles["account-review-star"]}
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className={styles["account-review-comment"]}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles["account-empty-state"]}>
            <MessageSquare className={styles["account-empty-icon"]} />
            <p>You haven't reviewed any products yet</p>
          </div>
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
                <div className={styles["account-sale-info"]}>
                  <div className={styles["account-sale-image"]}>
                    <ImageIcon size={24} color="#9ca3af" />
                  </div>
                  <div>
                    <div>{sale.item}</div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {sale.price}
                    </div>
                  </div>
                </div>
                <span className={styles["account-sale-status"]}>
                  {sale.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles["account-empty-state"]}>
            <Package className={styles["account-empty-icon"]} />
            <p>You haven't sold any items yet</p>
          </div>
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
        <span className={styles["account-order-status-count"]}>
          {count} orders
        </span>
      </div>
    </div>
  );
}
