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
  SettingsIcon,
  User,
  Plus,
  CircleCheckBig,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from "./account.module.css";
import { useNavigate } from "react-router-dom";
import OrderStatus from "../orderPages/OrderStatus";
import { mockOrders } from "../orderPages/mockOrders";

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "January 2023",
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
  const navigate = useNavigate();

  const getOrderCountsByStatus = () => {
    return {
      paid: mockOrders.filter((order) => order.status === "paid").length,
      sealed: mockOrders.filter((order) => order.status === "sealed").length,
      dispatched: mockOrders.filter((order) => order.status === "dispatched")
        .length,
      arrived: mockOrders.filter((order) => order.status === "arrived").length,
      confirmed: mockOrders.filter((order) => order.status === "confirmed")
        .length,
      returned: mockOrders.filter((order) => order.status === "returned")
        .length,
      reviewed: mockOrders.filter((order) => order.status === "reviewed")
        .length,
      total: mockOrders.length,
    };
  };

  const orderCounts = getOrderCountsByStatus();

  const navigateToPaidOrders = () => navigate("/orders/paid");
  const navigateToSealedOrders = () => navigate("/orders/sealed");
  const navigateToDispatchedOrders = () => navigate("/orders/dispatched");
  const navigateToArrivedOrders = () => navigate("/orders/arrived");
  const navigateToConfirmedOrders = () => navigate("/orders/confirmed");
  const navigateToReturnedOrders = () => navigate("/orders/returned");
  const navigateToReviewedOrders = () => navigate("/orders/reviewed");
  const navigateToAllOrders = () => navigate("/orders/all");
  const earlyBirdReg = () => {
    navigate("/early-bird-registration");
  };

  return (
    <div className={styles["account-container"]}>
      <div className="settings-header">
        <div
          className="header-content"
          style={{ justifyContent: "space-between" }}
        >
          <div className={styles["account-header"]}>
            <div>
              <User className="header-icon" />
            </div>
            <div>
              <h1>My Account</h1>
              <p>See all account infos</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["account-section"]}>
        <div className={styles["account-profile-header"]}>
          <h2 className={styles["account-h2"]}>Profile Information</h2>
          <button
            className={styles["account-edit-btn"]}
            onClick={() => navigate("/settings")}
          >
            <Edit size={16} style={{ marginRight: "8px" }} />
            Edit Profile
          </button>
        </div>
        <div className={styles["account-profile-details"]}>
          <div className={styles["account-profile-detail"]}>
            <span className={styles["account-detail-label"]}>Name</span>
            <span className={styles["account-detail-value"]}>
              {user.primaryInformation?.firstName}{" "}
              {user.primaryInformation?.lastName}
            </span>
          </div>
          <div className={styles["account-profile-detail"]}>
            <span className={styles["account-detail-label"]}>Email</span>
            <span className={styles["account-detail-value"]}>
              {user.primaryInformation?.email}
            </span>
          </div>
          <div className={styles["account-profile-detail"]}>
            <span className={styles["account-detail-label"]}>Phone</span>
            <span className={styles["account-detail-value"]}>
              {user.primaryInformation?.phone || "Not Provided"}
            </span>
          </div>
          <div className={styles["account-profile-detail"]}>
            <span className={styles["account-detail-label"]}>Member Since</span>
            <span className={styles["account-detail-value"]}>
              <span className={styles["account-detail-value"]}>
                {user.primaryInformation?.dateOfCreation
                  ? new Date(
                      user.primaryInformation.dateOfCreation
                        .split(" ")[0]
                        .split("-")
                        .reverse()
                        .join("-")
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles["account-section"]}>
        <div className={styles["account-profile-header"]}>
          <h2 className={styles["account-h2"]}>Order Status</h2>
          <button
            className={styles["account-edit-btn"]}
            onClick={navigateToAllOrders}
          >
            View All Orders ({orderCounts.total})
          </button>
        </div>
        <div className={styles["account-orders-grid"]}>
          <OrderStatus
            label="Paid"
            count={orderCounts.paid}
            Icon={CheckCircle}
            onClick={navigateToPaidOrders}
          />
          <OrderStatus
            label="Sealed"
            count={orderCounts.sealed}
            Icon={Package}
            onClick={navigateToSealedOrders}
          />
          <OrderStatus
            label="Dispatched"
            count={orderCounts.dispatched}
            Icon={Truck}
            onClick={navigateToDispatchedOrders}
          />
          <OrderStatus
            label="Arrived"
            count={orderCounts.arrived}
            Icon={CheckCircle}
            onClick={navigateToArrivedOrders}
          />
          <OrderStatus
            label="Confirmed"
            count={orderCounts.confirmed}
            Icon={CheckCircle}
            onClick={navigateToConfirmedOrders}
          />
          <OrderStatus
            label="Returned"
            count={orderCounts.returned}
            Icon={RefreshCcw}
            onClick={navigateToReturnedOrders}
          />
          <OrderStatus
            label="Reviewed"
            count={orderCounts.reviewed}
            Icon={MessageSquare}
            onClick={navigateToReviewedOrders}
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
      <div className={styles["account-section"]}>
        <h2 className={styles["account-h2"]}>Create Items</h2>

        <div className={styles["account-empty-state"]}>
          <Package className={styles["account-empty-icon"]} />
          <p>You haven't created any items yet</p>
          <button
            className={styles["account-edit-btn"]}
            onClick={() => navigate("/create")}
          >
            <Plus size={16} style={{ marginRight: "8px" }} />
            Create Item
          </button>
        </div>
      </div>
    </div>
  );
}
