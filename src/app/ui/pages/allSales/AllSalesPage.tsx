import React, { useState, useEffect } from "react";
import {
  Package,
  ArrowLeft,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Trash2,
  Image as ImageIcon,
  Loader,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { salesService } from "../../../redux/configuration/sales.service";
import styles from "./AllSales.module.css";

type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "revenue";
type StatusFilter = "all" | "completed" | "refunded" | "cancelled";

export default function AllSalesPage() {
  const navigate = useNavigate();
  const sales = useSelector((state: RootState) => state.sales);
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);
  const [addingTestData, setAddingTestData] = useState(false);

  const getUserSales = () => {
    return salesService.getSalesForCurrentUser();
  };

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const userSales = getUserSales();
      filterAndSortSales(searchTerm, filterStatus, sortBy, userSales);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [sales, searchTerm, filterStatus, sortBy]);

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleStatusFilter = (status: StatusFilter) => setFilterStatus(status);
  const handleSort = (option: SortOption) => setSortBy(option);

  const filterAndSortSales = (
    term: string,
    status: StatusFilter,
    sort: SortOption,
    salesData: any[]
  ) => {
    let filtered = [...salesData];

    // Filter by search term
    if (term) {
      filtered = filtered.filter(
        (sale) =>
          sale.title?.toLowerCase().includes(term.toLowerCase()) ||
          sale.description?.toLowerCase().includes(term.toLowerCase()) ||
          sale.buyerEmail?.toLowerCase().includes(term.toLowerCase()) ||
          sale.category?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(
        (sale) => sale.status?.toLowerCase() === status
      );
    }

    // Sort sales
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime();
        case "oldest":
          return new Date(a.soldAt).getTime() - new Date(b.soldAt).getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "revenue":
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredSales(sorted);
  };

  const getTotalRevenue = () => {
    return filteredSales
      .filter((sale) => sale.status === "completed")
      .reduce((sum, sale) => sum + sale.totalAmount, 0);
  };

  const getStatusCounts = () => {
    const userSales = getUserSales();
    return {
      completed: userSales.filter((sale: any) => sale.status === "completed")
        .length,
      refunded: userSales.filter((sale: any) => sale.status === "refunded")
        .length,
      cancelled: userSales.filter((sale: any) => sale.status === "cancelled")
        .length,
      total: userSales.length,
    };
  };

  const addTestSales = async () => {
    setAddingTestData(true);
    try {
      salesService.addTestSales();
      // Refresh the data after adding test sales
      setTimeout(() => {
        const userSales = getUserSales();
        filterAndSortSales(searchTerm, filterStatus, sortBy, userSales);
        setAddingTestData(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding test sales:", error);
      setAddingTestData(false);
    }
  };

  const clearSalesData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all sales data? This cannot be undone."
      )
    ) {
      salesService.clearAllSales();
      setTimeout(() => {
        const userSales = getUserSales();
        filterAndSortSales(searchTerm, filterStatus, sortBy, userSales);
      }, 500);
    }
  };

  const refreshSales = () => {
    const userSales = getUserSales();
    filterAndSortSales(searchTerm, filterStatus, sortBy, userSales);
  };

  const statusCounts = getStatusCounts();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#22c55e";
      case "refunded":
        return "#ef4444";
      case "cancelled":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleDeleteSale = (saleId: string) => {
    if (window.confirm("Are you sure you want to delete this sale record?")) {
      console.log("Delete sale:", saleId);
      // Implement actual deletion logic here
    }
  };

  const handleViewItem = (sale: any) => {
    const slug = (sale.title || `product-${sale.itemId}`)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    navigate(`/shop/${slug}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <button
              onClick={() => navigate("/account")}
              className={styles.backButton}
            >
              <ArrowLeft size={20} />
            </button>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>My Sales</h1>
            </div>
          </div>
        </div>
        <div className={styles.loadingState}>
          <Loader size={32} className={styles.spinner} />
          <p>Loading your sales data...</p>
        </div>
      </div>
    );
  }

  const userSales = getUserSales();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button
            onClick={() => navigate("/account")}
            className={styles.backButton}
          >
            <ArrowLeft size={20} />
          </button>
          <div className={styles.headerInfo}>
            <div className={styles.headerIcon}>
              <Package size={24} />
            </div>
            <div>
              <h1 className={styles.title}>My Sales</h1>
              <p className={styles.subtitle}>
                {filteredSales.length} sale
                {filteredSales.length !== 1 ? "s" : ""} •
                {formatPrice(getTotalRevenue())} total revenue
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* <button
          onClick={addTestSales}
          disabled={addingTestData}
          style={{
            padding: "10px 16px",
            background: addingTestData ? "#9ca3af" : "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: addingTestData ? "not-allowed" : "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {addingTestData ? <Loader size={16} /> : "Add Test Sales"}
          {addingTestData ? " Adding..." : ""}
        </button> */}

        <button
          onClick={refreshSales}
          style={{
            padding: "10px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

        {userSales.length > 0 && (
          <button
            onClick={clearSalesData}
            style={{
              padding: "10px 16px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Clear All Sales
          </button>
        )}
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{statusCounts.total}</div>
              <div className={styles.statLabel}>Total Sales</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <DollarSign size={20} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {formatPrice(getTotalRevenue())}
              </div>
              <div className={styles.statLabel}>Revenue</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Package size={20} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{statusCounts.completed}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className={styles.statusDistribution}>
          <h3>Sales Distribution</h3>
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <div className={styles.statusValue} style={{ color: "#22c55e" }}>
                {statusCounts.completed}
              </div>
              <div className={styles.statusLabel}>Completed</div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusValue} style={{ color: "#ef4444" }}>
                {statusCounts.refunded}
              </div>
              <div className={styles.statusLabel}>Refunded</div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusValue} style={{ color: "#6b7280" }}>
                {statusCounts.cancelled}
              </div>
              <div className={styles.statusLabel}>Cancelled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search sales by item, description, buyer, or category..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={16} />
            <span>Filter by status:</span>
            <div className={styles.statusFilters}>
              <button
                onClick={() => handleStatusFilter("all")}
                className={`${styles.filterBtn} ${
                  filterStatus === "all" ? styles.active : ""
                }`}
              >
                All ({statusCounts.total})
              </button>
              {["completed", "refunded", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status as StatusFilter)}
                  className={`${styles.filterBtn} ${
                    filterStatus === status ? styles.active : ""
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} (
                  {statusCounts[status as keyof typeof statusCounts]})
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sortGroup}>
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              className={styles.sortSelect}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Highest Price</option>
              <option value="price-low">Lowest Price</option>
              <option value="revenue">Highest Revenue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className={styles.salesSection}>
        {filteredSales.length > 0 ? (
          <div className={styles.salesList}>
            {filteredSales.map((sale) => (
              <div key={sale.id} className={styles.saleCard}>
                <div className={styles.saleImage}>
                  {sale.image ? (
                    <img src={sale.image} alt={sale.title} />
                  ) : (
                    <ImageIcon size={24} color="#9ca3af" />
                  )}
                </div>

                <div className={styles.saleContent}>
                  <div className={styles.saleHeader}>
                    <h3 className={styles.saleTitle}>{sale.title}</h3>
                    <div className={styles.salePrice}>
                      {formatPrice(sale.price)} × {sale.quantity}
                    </div>
                  </div>

                  <p className={styles.saleDescription}>
                    {sale.description || "No description available"}
                  </p>

                  <div className={styles.saleMeta}>
                    {sale.category && (
                      <span className={styles.saleCategory}>
                        {sale.category}
                      </span>
                    )}
                    <span className={styles.saleBuyer}>
                      Sold to: {sale.buyerEmail}
                    </span>
                    <span className={styles.saleDate}>
                      <Calendar size={14} />
                      {formatDate(sale.soldAt)}
                    </span>
                  </div>

                  <div className={styles.saleTotal}>
                    Total: {formatPrice(sale.totalAmount)}
                  </div>
                </div>

                <div className={styles.saleActions}>
                  <div
                    className={styles.saleStatus}
                    style={{
                      backgroundColor: `${getStatusColor(sale.status)}15`,
                      color: getStatusColor(sale.status),
                    }}
                  >
                    {sale.status?.charAt(0).toUpperCase() +
                      sale.status?.slice(1)}
                  </div>

                  <div className={styles.actionButtons}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleViewItem(sale)}
                      title="View Item"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteSale(sale.id)}
                      title="Delete Sale Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Package size={48} />
            <h3>No sales found</h3>
            <p>
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't made any sales yet. When customers purchase your items, they will appear here."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={addTestSales}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  marginTop: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {addingTestData ? (
                  <Loader size={16} />
                ) : (
                  "Add Test Sales to Get Started"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
