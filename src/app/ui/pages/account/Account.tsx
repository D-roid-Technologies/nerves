import React, { useState, useEffect } from "react";
import {
  Star,
  CheckCircle,
  Truck,
  Package,
  RefreshCcw,
  MessageSquare,
  Edit,
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  Loader,
  TrendingUp,
  DollarSign,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from "./account.module.css";
import { useNavigate } from "react-router-dom";
import OrderStatus from "../orderPages/OrderStatus";
import { authService } from "../../../redux/configuration/auth.service";
import { salesService } from "../../../redux/configuration/sales.service";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

interface UserItem {
  id: string | number;
  title?: string;
  name?: string;
  price: number;
  thumbnail?: string;
  image?: string;
  category?: string;
  stock?: number;
  sellerId?: string;
  description?: string;
  discountPercentage?: number;
  rating?: number;
  images?: string[];
  brand?: string;
}

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
      comment: "Great sound quality! The battery life is impressive.",
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
};

export default function MyAccountPage() {
  const user = useSelector((state: RootState) => state.user);
  const userType = user.primaryInformation?.userType || "both";
  const isSeller = userType === "seller";
  const isBoth = userType === "both";
  const showSections = isSeller || isBoth;
  const paidOrders = useSelector((state: RootState) => state.paidOrders);
  const sales = useSelector((state: RootState) => state.sales);
  const navigate = useNavigate();

  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<UserItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | number | null>(
    null
  );
  const [salesLoading, setSalesLoading] = useState(false);

  const navigateToPaidOrders = () => navigate("/orders/paid");
  const navigateToSealedOrders = () => navigate("/orders/sealed");
  const navigateToDispatchedOrders = () => navigate("/orders/dispatched");
  const navigateToArrivedOrders = () => navigate("/orders/arrived");
  const navigateToConfirmedOrders = () => navigate("/orders/confirmed");
  const navigateToReturnedOrders = () => navigate("/orders/returned");
  const navigateToReviewedOrders = () => navigate("/orders/reviewed");
  const navigateToAllOrders = () => navigate("/orders/all");
  const navigateToAllReviews = () => navigate("/reviews/all");
  const navigateToAllSales = () => navigate("/sales/all");

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        setLoadingItems(true);
        const allItems = await authService.fetchAllListedItems();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const myItems = allItems.filter((item: any) => {
            const itemSellerId =
              typeof item.sellerId === "object"
                ? item.sellerId.email
                : item.sellerId;
            return itemSellerId === currentUser.email;
          });
          setUserItems(myItems);
        }
      } catch (error) {
        console.error("Error fetching user items:", error);
      } finally {
        setLoadingItems(false);
      }
    };

    if (showSections) {
      fetchUserItems();
    }
  }, [showSections]);

  const getOrderCountsByStatus = () => {
    const orders = paidOrders.orders;
    return {
      paid: orders.filter((order: any) => order.status === "paid").length,
      sealed: orders.filter((order: any) => order.status === "sealed").length,
      dispatched: orders.filter((order: any) => order.status === "dispatched")
        .length,
      arrived: orders.filter((order: any) => order.status === "arrived").length,
      confirmed: orders.filter((order: any) => order.status === "confirmed")
        .length,
      returned: orders.filter((order: any) => order.status === "returned")
        .length,
      reviewed: orders.filter((order: any) => order.status === "reviewed")
        .length,
      total: orders.length,
    };
  };

  const getUserSales = () => {
    return salesService.getSalesForCurrentUser();
  };

  // const addTestSales = () => {
  //   setSalesLoading(true);
  //   try {
  //     salesService.addTestSales();
  //     toast.success("Test sales added! Refreshing...");
  //     // Refresh after a short delay
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 1500);
  //   } catch (error) {
  //     toast.error("Failed to add test sales");
  //     console.error(error);
  //   } finally {
  //     setSalesLoading(false);
  //   }
  // };

  const clearSalesData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all sales data? This cannot be undone."
      )
    ) {
      salesService.clearAllSales();
      toast.success("Sales data cleared! Refreshing...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const orderCounts = getOrderCountsByStatus();
  const userSales = getUserSales();
  const completedSales = userSales.filter(
    (sale: any) => sale.status === "completed"
  );
  const totalSalesCount = completedSales.reduce(
    (total: number, sale: any) => total + sale.quantity,
    0
  );
  const totalRevenue = completedSales.reduce(
    (total: number, sale: any) => total + sale.totalAmount,
    0
  );

  const handleDeleteItem = async (item: UserItem) => {
    try {
      setDeletingItemId(item.id);
      const success = await authService.deleteMyItem(item.id);
      if (success) {
        setUserItems((prevItems) =>
          prevItems.filter((prevItem) => prevItem.id !== item.id)
        );
        await authService.fetchAllListedItems();
        setItemToDelete(null);
        toast.success(`"${item.title || item.name}" deleted successfully!`, {
          style: { background: "#4BB543", color: "#fff" },
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
    } finally {
      setDeletingItemId(null);
    }
  };

  const navigateToItemDetails = (item: UserItem) => {
    const slug = (item.title || item.name || `product-${item.id}`)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    navigate(`/shop/${slug}`);
  };

  const navigateToEditItem = (item: UserItem) => {
    navigate("/create", { state: { editItem: item } });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={styles["account-container"]}>
      {itemToDelete && (
        <div className={styles["delete-confirmation-modal"]}>
          <div className={styles["delete-confirmation-content"]}>
            <h3>Delete Product</h3>
            <p>
              Are you sure you want to delete "
              {itemToDelete.title || itemToDelete.name}"? This action cannot be
              undone.
            </p>
            <div className={styles["delete-confirmation-actions"]}>
              <button
                className={styles["cancel-delete-btn"]}
                onClick={() => setItemToDelete(null)}
                disabled={deletingItemId === itemToDelete.id}
              >
                Cancel
              </button>
              <button
                className={styles["confirm-delete-btn"]}
                onClick={() => handleDeleteItem(itemToDelete)}
                disabled={deletingItemId === itemToDelete.id}
              >
                {deletingItemId === itemToDelete.id ? (
                  <>
                    <Loader size={16} className={styles["delete-loader"]} />{" "}
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <Edit size={16} style={{ marginRight: "8px" }} /> Edit Profile
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

      {showSections && (
        <div className={styles["account-section"]}>
          <div className={styles["account-profile-header"]}>
            <h2 className={styles["account-h2"]}>My Reviews</h2>
            <button
              className={styles["account-edit-btn"]}
              onClick={navigateToAllReviews}
            >
              View All Reviews (6)
            </button>
          </div>
          {mockUser.reviews.length > 0 ? (
            <div className={styles["account-list"]}>
              {mockUser.reviews.slice(0, 3).map((review) => (
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
      )}

      {showSections && (
        <div className={styles["account-section"]}>
          <div className={styles["account-profile-header"]}>
            <h2 className={styles["account-h2"]}>My Sales</h2>
            <div className={styles["sales-stats"]}>
              <span className={styles["sales-stat"]}>
                <TrendingUp size={16} /> {totalSalesCount} Sold
              </span>
              <span className={styles["sales-stat"]}>
                {formatPrice(totalRevenue)}
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {/* <button
                className={styles["account-edit-btn"]}
                onClick={addTestSales}
                disabled={salesLoading}
                style={{
                  background: "#f59e0b",
                  opacity: salesLoading ? 0.6 : 1,
                }}
              >
                {salesLoading ? (
                  <Loader size={16} className={styles["delete-loader"]} />
                ) : (
                  "Add Test Sales"
                )}
              </button> */}
              <button
                className={styles["account-edit-btn"]}
                onClick={navigateToAllSales}
                style={{ background: "#3b82f6" }}
              >
                View All Sales ({completedSales.length})
              </button>
              {/* {userSales.length > 0 && (
                <button
                  className={styles["account-edit-btn"]}
                  onClick={clearSalesData}
                  style={{ background: "#ef4444" }}
                >
                  Clear Sales
                </button>
              )} */}
            </div>
          </div>

          {userSales.length > 0 ? (
            <div className={styles["account-list"]}>
              {userSales.slice(0, 3).map((sale: any) => (
                <div
                  key={sale.id}
                  className={`${styles["account-list-item"]} ${styles["account-sale-item"]}`}
                >
                  <div className={styles["account-sale-info"]}>
                    <div className={styles["account-sale-image"]}>
                      {sale.image ? (
                        <img src={sale.image} alt={sale.title} />
                      ) : (
                        <ImageIcon size={24} color="#9ca3af" />
                      )}
                    </div>
                    <div className={styles["account-sale-details"]}>
                      <div className={styles["account-sale-title"]}>
                        {sale.title}
                      </div>
                      <div className={styles["account-sale-meta"]}>
                        <span>Qty: {sale.quantity}</span>
                        <span>{formatPrice(sale.price)} each</span>
                        <span>Total: {formatPrice(sale.totalAmount)}</span>
                      </div>
                      <div className={styles["account-sale-buyer"]}>
                        Sold to: {sale.buyerEmail}
                      </div>
                      <div className={styles["account-sale-date"]}>
                        {new Date(sale.soldAt).toLocaleDateString()} •
                        <span
                          style={{
                            color:
                              sale.status === "completed"
                                ? "#10b981"
                                : sale.status === "refunded"
                                ? "#ef4444"
                                : "#6b7280",
                            fontWeight: "600",
                            marginLeft: "8px",
                          }}
                        >
                          {sale.status?.charAt(0).toUpperCase() +
                            sale.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {userSales.length > 3 && (
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <button
                    className={styles["account-edit-btn"]}
                    onClick={navigateToAllSales}
                    style={{ background: "#3b82f6" }}
                  >
                    View All {userSales.length} Sales
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles["account-empty-state"]}>
              <Package className={styles["account-empty-icon"]} />
              <p>You haven't made any sales yet</p>
              <p className={styles["account-empty-subtext"]}>
                When customers purchase your items, they will appear here.
                {/* <br />
                <button
                  onClick={addTestSales}
                  style={{
                    background: "#f59e0b",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    marginTop: "12px",
                    cursor: "pointer",
                  }}
                >
                  Add Test Sales to See How It Works
                </button> */}
              </p>
            </div>
          )}
        </div>
      )}

      {showSections && (
        <div className={styles["account-section"]}>
          <div className={styles["account-profile-header"]}>
            <h2 className={styles["account-h2"]}>My Items</h2>
            <button
              className={styles["account-edit-btn"]}
              onClick={() => navigate("/create")}
            >
              <Plus size={16} style={{ marginRight: "8px" }} /> Create Item
            </button>
          </div>

          {loadingItems ? (
            <div className={styles["account-empty-state"]}>
              <div className={styles["account-loading"]}>
                Loading your items...
              </div>
            </div>
          ) : userItems.length > 0 ? (
            <div className={styles["account-items-grid"]}>
              {userItems.map((item) => (
                <div key={item.id} className={styles["account-item-card"]}>
                  <div className={styles["account-item-image"]}>
                    <img
                      src={
                        item.thumbnail || item.image || "/placeholder-image.jpg"
                      }
                      alt={item.title || item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                    />
                  </div>
                  <div className={styles["account-item-content"]}>
                    <h3 className={styles["account-item-title"]}>
                      {item.title || item.name || "Untitled Product"}
                    </h3>
                    <p className={styles["account-item-price"]}>
                      {formatPrice(item.price)}
                    </p>
                    <div className={styles["account-item-meta"]}>
                      <span className={styles["account-item-category"]}>
                        {item.category || "Uncategorized"}
                      </span>
                      <span className={styles["account-item-stock"]}>
                        Stock: {item.stock || 0}
                      </span>
                    </div>
                  </div>
                  <div className={styles["account-item-actions"]}>
                    <button
                      className={styles["account-item-view-btn"]}
                      onClick={() => navigateToItemDetails(item)}
                      title="View Item"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={styles["account-item-edit-btn"]}
                      onClick={() => navigateToEditItem(item)}
                      title="Edit Item"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={styles["account-item-delete-btn"]}
                      onClick={() => setItemToDelete(item)}
                      title="Delete Item"
                      disabled={deletingItemId === item.id}
                    >
                      {deletingItemId === item.id ? (
                        <Loader size={16} className={styles["delete-loader"]} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles["account-empty-state"]}>
              <Package className={styles["account-empty-icon"]} />
              <p>You haven't created any items yet</p>
              <button
                className={styles["account-edit-btn"]}
                onClick={() => navigate("/create")}
              >
                <Plus size={16} style={{ marginRight: "8px" }} /> Create Your
                First Item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
