import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  ShoppingBag,
  Mail,
  Phone,
  MessageCircle,
  Receipt,
  ArrowRight,
  Clock,
} from "lucide-react";
import styles from "./OrderStatus.module.css";

interface OrderStatusProps {
  status?: "success" | "failed" | "cancelled";
  orderId?: string;
  amount?: number;
  customerEmail?: string;
  transactionRef?: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  status: propStatus,
  orderId: propOrderId,
  amount: propAmount,
  customerEmail: propCustomerEmail,
  transactionRef: propTransactionRef,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [countdown, setCountdown] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  // Get status from URL params, location state, or props
  const status =
    propStatus ||
    searchParams.get("status") ||
    location.state?.status ||
    "success";

  const orderId =
    propOrderId ||
    searchParams.get("orderId") ||
    location.state?.orderId ||
    "ORD-UNKNOWN";

  const amount =
    propAmount ||
    parseFloat(searchParams.get("amount") || "0") ||
    location.state?.amount ||
    0;

  const customerEmail =
    propCustomerEmail ||
    searchParams.get("email") ||
    location.state?.email ||
    "";

  const transactionRef =
    propTransactionRef ||
    searchParams.get("ref") ||
    location.state?.transactionRef ||
    "";

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Auto-redirect countdown for successful orders
  useEffect(() => {
    setIsLoading(false);

    // if (status === "success") {
    //   const timer = setInterval(() => {
    //     setCountdown((prev) => {
    //       if (prev <= 1) {
    //         navigate("/orders/paid", { replace: true });
    //         return 0;
    //       }
    //       return prev - 1;
    //     });
    //   }, 1000);

    //   return () => clearInterval(timer);
    // }
  }, [status, navigate]);

  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle,
          title: "Order Successful!",
          subtitle:
            "Thank you for your purchase. Your order has been confirmed and will be processed shortly.",
          className: styles["order-status-success"],
        };
      case "failed":
        return {
          icon: XCircle,
          title: "Payment Failed",
          subtitle:
            "Unfortunately, your payment could not be processed. Please try again or contact support.",
          className: styles["order-status-failed"],
        };
      case "cancelled":
        return {
          icon: AlertCircle,
          title: "Order Cancelled",
          subtitle:
            "Your order was cancelled. No charges have been made to your account.",
          className: styles["order-status-cancelled"],
        };
      default:
        return {
          icon: CheckCircle,
          title: "Order Status Unknown",
          subtitle:
            "We are processing your request. Please contact support if you need assistance.",
          className: styles["order-status-success"],
        };
    }
  };

  const statusConfig = getStatusConfig();
  const IconComponent = statusConfig.icon;

  if (isLoading) {
    return (
      <div className={styles["order-status-container"]}>
        <div className={styles["order-status-card"]}>
          <div className={styles["order-status-loading"]}>
            <div className={styles["order-loading-spinner"]}></div>
            <p className={styles["order-loading-text"]}>
              Processing your order...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["order-status-container"]}>
      <div
        className={`${styles["order-status-card"]} ${statusConfig.className}`}
      >
        <div className={styles["order-status-icon-container"]}>
          <IconComponent className={styles["order-status-icon"]} />
        </div>

        <h1 className={styles["order-status-title"]}>{statusConfig.title}</h1>
        <p className={styles["order-status-subtitle"]}>
          {statusConfig.subtitle}
        </p>

        {/* Order Details Card */}
        <div className={styles["order-details-card"]}>
          <h3 className={styles["order-details-title"]}>
            <Receipt className={styles["order-status-btn-icon"]} />
            Order Details
          </h3>

          <div className={styles["order-details-grid"]}>
            <div className={styles["order-detail-item"]}>
              <span className={styles["order-detail-label"]}>Order Number</span>
              <span className={styles["order-detail-value"]}>
                <span className={styles["order-id-highlight"]}>#{orderId}</span>
              </span>
            </div>

            {amount > 0 && (
              <div className={styles["order-detail-item"]}>
                <span className={styles["order-detail-label"]}>Amount</span>
                <span
                  className={`${styles["order-detail-value"]} ${styles["order-amount-highlight"]}`}
                >
                  {formatPrice(amount)}
                </span>
              </div>
            )}

            {customerEmail && (
              <div className={styles["order-detail-item"]}>
                <span className={styles["order-detail-label"]}>Email</span>
                <span className={styles["order-detail-value"]}>
                  {customerEmail}
                </span>
              </div>
            )}

            {transactionRef && (
              <div className={styles["order-detail-item"]}>
                <span className={styles["order-detail-label"]}>
                  Transaction Ref
                </span>
                <span className={styles["order-detail-value"]}>
                  {transactionRef}
                </span>
              </div>
            )}

            <div className={styles["order-detail-item"]}>
              <span className={styles["order-detail-label"]}>Status</span>
              <span className={styles["order-detail-value"]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <div className={styles["order-detail-item"]}>
              <span className={styles["order-detail-label"]}>Date</span>
              <span className={styles["order-detail-value"]}>
                {new Date().toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Success-specific countdown timer */}
        {/* {status === "success" && countdown > 0 && (
          <div className={styles["order-timer"]}>
            <p className={styles["order-timer-text"]}>Redirecting in:</p>
            <div className={styles["order-countdown"]}>{countdown}s</div>
          </div>
        )} */}

        <div className={styles["order-status-actions"]}>
          {status === "success" && (
            <>
              <button
                onClick={() => navigate("/shop", { replace: true })}
                className={`${styles["order-status-btn"]} ${styles["order-status-btn-primary"]}`}
              >
                <Home className={styles["order-status-btn-icon"]} />
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/orders/paid")}
                className={`${styles["order-status-btn"]} ${styles["order-status-btn-success"]}`}
              >
                <Receipt className={styles["order-status-btn-icon"]} />
                View Order History
              </button>
            </>
          )}

          {status === "failed" && (
            <>
              <button
                onClick={() => navigate("/checkout")}
                className={`${styles["order-status-btn"]} ${styles["order-status-btn-primary"]}`}
              >
                <ArrowRight className={styles["order-status-btn-icon"]} />
                Try Again
              </button>
              <button
                onClick={() => navigate("/contact")}
                className={`${styles["order-status-btn"]} ${styles["order-status-btn-secondary"]}`}
              >
                <MessageCircle className={styles["order-status-btn-icon"]} />
                Contact Support
              </button>
            </>
          )}

          {status === "cancelled" && (
            <>
              <button
                onClick={() => navigate("/checkout")}
                className={`${styles["order-status-btn"]} ${styles["order-status-btn-warning"]}`}
              >
                <ShoppingBag className={styles["order-status-btn-icon"]} />
                Return to Checkout
              </button>
              <button
                onClick={() => navigate("/shop")}
                className={`${styles["order-status-btn"]} ${styles["order-status-btn-secondary"]}`}
              >
                <Home className={styles["order-status-btn-icon"]} />
                Continue Shopping
              </button>
            </>
          )}
        </div>

        {/* Support Information */}
        {(status === "failed" || status === "cancelled") && (
          <div className={styles["order-support-info"]}>
            <h4 className={styles["order-support-title"]}>
              <MessageCircle className={styles["order-status-btn-icon"]} />
              Need Help?
            </h4>
            <p className={styles["order-support-text"]}>
              Our support team is here to help you resolve any issues.
            </p>
            <div className={styles["order-support-contacts"]}>
              <a
                href="mailto:support@nervesystems.com"
                className={styles["order-support-contact"]}
              >
                <Mail className={styles["order-status-btn-icon"]} />
                support@nervesystems.com
              </a>
              <a
                href="tel:+234-XXX-XXXX"
                className={styles["order-support-contact"]}
              >
                <Phone className={styles["order-status-btn-icon"]} />
                +234-XXX-XXXX
              </a>
            </div>
          </div>
        )}

        {/* Success-specific additional info */}
        {status === "success" && (
          <div className={styles["order-support-info"]}>
            <h4 className={styles["order-support-title"]}>
              <Clock className={styles["order-status-btn-icon"]} />
              What's Next?
            </h4>
            <p className={styles["order-support-text"]}>
              We'll send you an email confirmation with tracking details once
              your order ships.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
