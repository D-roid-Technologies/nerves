import React, { useState } from "react";
import {
  Package,
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AllSales.module.css";

// Extended mock sales data
const mockSales = [
  {
    id: 1,
    item: "Used iPhone 12",
    status: "Sold",
    price: "₦450",
    priceValue: 450,
    dateListed: "3 months ago",
    dateSold: "2 weeks ago",
    dateSort: new Date("2024-08-20"),
    category: "Electronics",
    views: 156,
    image: null,
    description:
      "Excellent condition iPhone 12, 128GB, Blue color with original box and charger.",
  },
  {
    id: 2,
    item: "Gaming Laptop",
    status: "Sold",
    price: "₦1200",
    priceValue: 1200,
    dateListed: "4 months ago",
    dateSold: "1 month ago",
    dateSort: new Date("2024-08-04"),
    category: "Electronics",
    views: 89,
    image: null,
    description:
      "High-performance gaming laptop with RTX 3070, 16GB RAM, 1TB SSD.",
  },
  {
    id: 3,
    item: "Designer Watch",
    status: "Active",
    price: "₦850",
    priceValue: 850,
    dateListed: "2 weeks ago",
    dateSold: null,
    dateSort: new Date("2024-08-20"),
    category: "Fashion",
    views: 42,
    image: null,
    description:
      "Luxury swiss watch in perfect condition, comes with original packaging.",
  },
  {
    id: 4,
    item: "Mountain Bike",
    status: "Sold",
    price: "₦380",
    priceValue: 380,
    dateListed: "5 months ago",
    dateSold: "4 months ago",
    dateSort: new Date("2024-05-04"),
    category: "Sports",
    views: 78,
    image: null,
    description:
      "Well-maintained mountain bike, perfect for trails and city riding.",
  },
  {
    id: 5,
    item: "Kitchen Mixer",
    status: "sold",
    price: "₦120",
    priceValue: 120,
    dateListed: "1 week ago",
    dateSold: null,
    dateSort: new Date("2024-08-28"),
    category: "Home",
    views: 23,
    image: null,
    description:
      "Professional stand mixer, barely used, includes all attachments.",
  },
  {
    id: 6,
    item: "Vintage Guitar",
    status: "Active",
    price: "₦650",
    priceValue: 650,
    dateListed: "6 months ago",
    dateSold: null,
    dateSort: new Date("2024-03-04"),
    category: "Music",
    views: 134,
    image: null,
    description: "1980s acoustic guitar in excellent condition with hard case.",
  },
];

type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "views";
type StatusFilter = "all" | "active" | "sold";

export default function AllSalesPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState(mockSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterAndSortSales(term, filterStatus, sortBy);
  };

  const handleStatusFilter = (status: StatusFilter) => {
    setFilterStatus(status);
    filterAndSortSales(searchTerm, status, sortBy);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    filterAndSortSales(searchTerm, filterStatus, option);
  };

  const filterAndSortSales = (
    term: string,
    status: StatusFilter,
    sort: SortOption
  ) => {
    let filtered = mockSales;

    // Filter by search term
    if (term) {
      filtered = filtered.filter(
        (sale) =>
          sale.item.toLowerCase().includes(term.toLowerCase()) ||
          sale.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(
        (sale) => sale.status.toLowerCase() === status
      );
    }

    // Sort sales
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.dateSort.getTime() - a.dateSort.getTime();
        case "oldest":
          return a.dateSort.getTime() - b.dateSort.getTime();
        case "price-high":
          return b.priceValue - a.priceValue;
        case "price-low":
          return a.priceValue - b.priceValue;
        case "views":
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setSales(sorted);
  };

  const getTotalRevenue = () => {
    return sales
      .filter((sale) => sale.status === "Sold")
      .reduce((sum, sale) => sum + sale.priceValue, 0);
  };

  const getStatusCounts = () => {
    return {
      active: sales.filter((sale) => sale.status === "Active").length,
      sold: sales.filter((sale) => sale.status === "Sold").length,
      pending: sales.filter((sale) => sale.status === "Pending").length,
      expired: sales.filter((sale) => sale.status === "Expired").length,
    };
  };

  const statusCounts = getStatusCounts();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sold":
        return "#22c55e";
      case "active":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

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
            <div>
              <h1 className={styles.title}>My Sales</h1>
              <p className={styles.subtitle}>
                {sales.length} item{sales.length !== 1 ? "s" : ""} • $
                {getTotalRevenue().toLocaleString()} total revenue
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
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
                All
              </button>
              {["active", "sold"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status as StatusFilter)}
                  className={`${styles.filterBtn} ${
                    filterStatus === status ? styles.active : ""
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
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
              <option value="views">Most Views</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className={styles.salesSection}>
        {sales.length > 0 ? (
          <div className={styles.salesList}>
            {sales.map((sale) => (
              <div key={sale.id} className={styles.saleCard}>
                <div className={styles.saleImage}>
                  <ImageIcon size={24} color="#9ca3af" />
                </div>

                <div className={styles.saleContent}>
                  <div className={styles.saleHeader}>
                    <h3 className={styles.saleTitle}>{sale.item}</h3>
                    <div className={styles.salePrice}>{sale.price}</div>
                  </div>

                  <p className={styles.saleDescription}>{sale.description}</p>

                  <div className={styles.saleMeta}>
                    <span className={styles.saleCategory}>{sale.category}</span>

                    <span className={styles.saleDate}>
                      Listed {sale.dateListed}
                    </span>
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
                    {sale.status}
                  </div>

                  <div className={styles.actionButtons}>
                    <button className={styles.actionBtn}>
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
            <h3>No items found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
