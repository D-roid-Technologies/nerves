import type React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Grid,
  List,
  Filter,
  ChevronDown,
  Package,
  TrendingUp,
  Star,
  Eye,
  ShoppingCart,
} from "lucide-react";
import styles from "./categories.module.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../redux/configuration/auth.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  name?: string;
  sellerId: string;
}

interface CategoryData {
  name: string;
  count: number;
  products: Product[];
  image: string;
  description: string;
  averagePrice: number;
  topBrands: string[];
}

const CategoriesPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count" | "price">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const listedItems = useSelector(
    (state: RootState) => state.products.listedItems
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Use Redux listedItems or fetch from Firestore
      const allItems =
        listedItems && listedItems.length > 0
          ? listedItems
          : await authService.fetchAllListedItems();

      console.log(
        "🔄 Raw Firestore items count for categories:",
        allItems.length
      );

      // Transform Firestore data to match Product interface
      const transformedProducts: Product[] = allItems.map(
        (product: any, index: number) => {
          // Handle sellerId
          let sellerId = "unknown@example.com";
          if (product.sellerId) {
            if (typeof product.sellerId === "object") {
              sellerId =
                product.sellerId.email ||
                product.sellerId.name ||
                "unknown@example.com";
            } else {
              sellerId = product.sellerId;
            }
          }

          // Use actual ID from Firestore or generate one
          const productId = product.id || Date.now() + index;

          // Handle images
          let images = product.images || [];
          if (!Array.isArray(images)) {
            images = [];
          }

          // Handle thumbnail - use image if thumbnail is not available
          const thumbnail =
            product.thumbnail || product.image || "/placeholder.svg";

          // Handle name/title - use title for compatibility with existing interface
          const title = product.title || product.name || `Product ${productId}`;
          const name = product.name || title;

          // Handle category - ensure it exists and is properly formatted
          const category = product.category?.toLowerCase() || "uncategorized";

          return {
            id: productId,
            title: title,
            name: name,
            description:
              product.description || `High-quality ${category} product`,
            price: product.price ?? 0,
            discountPercentage: product.discountPercentage || 0,
            rating: product.rating ?? 0,
            stock: product.stock ?? 0,
            brand: product.brand ?? "Unknown",
            category: category,
            thumbnail: thumbnail,
            images: images,
            sellerId: sellerId,
          };
        }
      );

      console.log(
        "✅ Transformed products for categories:",
        transformedProducts.length
      );
      setProducts(transformedProducts);
    } catch (err) {
      console.error("Error fetching products for categories:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const categoryMap = new Map<string, CategoryData>();

    products.forEach((product) => {
      const categoryName = product.category;
      if (!categoryName || categoryName === "uncategorized") return;

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          count: 0,
          products: [],
          image: product.thumbnail,
          description: `Discover amazing ${categoryName} products`,
          averagePrice: 0,
          topBrands: [],
        });
      }

      const category = categoryMap.get(categoryName)!;
      category.count++;
      category.products.push(product);

      // Update category image with the first product's thumbnail if not set
      if (!category.image || category.image === "/placeholder.svg") {
        category.image = product.thumbnail;
      }
    });

    // Calculate additional data for each category
    categoryMap.forEach((category) => {
      // Calculate average price
      if (category.products.length > 0) {
        const totalPrice = category.products.reduce(
          (sum, product) => sum + product.price,
          0
        );
        category.averagePrice = totalPrice / category.products.length;
      }

      // Get top brands
      const brandCounts = new Map<string, number>();
      category.products.forEach((product) => {
        if (product.brand && product.brand !== "Unknown") {
          brandCounts.set(
            product.brand,
            (brandCounts.get(product.brand) || 0) + 1
          );
        }
      });

      category.topBrands = Array.from(brandCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([brand]) => brand);

      // Update description with actual count
      category.description = `Explore ${category.count} high-quality ${category.name} products`;
    });

    return Array.from(categoryMap.values());
  }, [products]);

  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort categories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "count":
          return b.count - a.count;
        case "price":
          return b.averagePrice - a.averagePrice;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [categories, searchTerm, sortBy]);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("phone") || name.includes("smartphone")) return "📱";
    if (name.includes("laptop") || name.includes("computer")) return "💻";
    if (name.includes("fragrance") || name.includes("perfume")) return "🌸";
    if (name.includes("skincare") || name.includes("beauty")) return "✨";
    if (name.includes("grocery") || name.includes("food")) return "🛒";
    if (name.includes("decoration") || name.includes("home")) return "🏠";
    if (name.includes("furniture")) return "🪑";
    if (name.includes("tops") || name.includes("shirt")) return "👕";
    if (name.includes("dress") || name.includes("women")) return "👗";
    if (name.includes("shoe") || name.includes("footwear")) return "👟";
    if (name.includes("watch") || name.includes("time")) return "⌚";
    if (name.includes("bag") || name.includes("handbag")) return "👜";
    if (name.includes("jewellery") || name.includes("jewelry")) return "💎";
    if (name.includes("sunglasses") || name.includes("glasses")) return "🕶️";
    if (name.includes("automotive") || name.includes("car")) return "🚗";
    if (name.includes("motorcycle")) return "🏍️";
    if (name.includes("lighting")) return "💡";
    return "📦";
  };

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <h2>Loading Categories...</h2>
          <p>Fetching the latest product categories for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <Package className={styles.errorIcon} />
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchProducts} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>Product Categories</h1>
            <p>
              Explore our wide range of products across {categories.length}{" "}
              categories
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      {/* <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${
                viewMode === "grid" ? styles.active : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode === "list" ? styles.active : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
          </div>

          <div className={styles.sortContainer}>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "count" | "price")
              }
              className={styles.sortSelect}
            >
              <option value="name">Sort by Name</option>
              <option value="count">Sort by Product Count</option>
              <option value="price">Sort by Average Price</option>
            </select>
            <ChevronDown className={styles.chevronIcon} />
          </div>
        </div>
      </div> */}

      {/* Categories Grid/List */}
      <div
        className={`${styles.categoriesContainer} ${
          viewMode === "list" ? styles.listView : styles.gridView
        }`}
      >
        {filteredCategories.map((category) => (
          <div
            key={category.name}
            className={styles.categoryCard}
            onClick={() => navigate(`/shop`)}
          >
            <div className={styles.categoryImage}>
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className={styles.categoryOverlay}>
                <Eye className={styles.overlayIcon} />
                <span>View Products</span>
              </div>
            </div>

            <div className={styles.categoryContent}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  {getCategoryIcon(category.name)}
                </div>
                <div className={styles.categoryTitle}>
                  <h3>{formatCategoryName(category.name)}</h3>
                  <span className={styles.productCount}>
                    {category.count}{" "}
                    {category.count === 1 ? "product" : "products"}
                  </span>
                </div>
              </div>

              <p className={styles.categoryDescription}>
                {category.description}
              </p>

              <div className={styles.categoryStats}>
                <div className={styles.statItem}>
                  <TrendingUp className={styles.statIcon} />
                  <span>Avg. ${category.averagePrice.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                  <Star className={styles.statIcon} />
                  <span>
                    {category.products.length > 0
                      ? (
                          category.products.reduce(
                            (sum, product) => sum + product.rating,
                            0
                          ) / category.products.length
                        ).toFixed(1)
                      : "0.0"}
                  </span>
                </div>
              </div>

              {category.topBrands.length > 0 && (
                <div className={styles.topBrands}>
                  <span className={styles.brandsLabel}>Top Brands:</span>
                  <div className={styles.brandsList}>
                    {category.topBrands.map((brand) => (
                      <span key={brand} className={styles.brandTag}>
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className={styles.exploreButton}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/shop`);
                }}
              >
                <ShoppingCart className={styles.buttonIcon} />
                Explore Category
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className={styles.emptyState}>
          <Search className={styles.emptyIcon} />
          <h3>No categories found</h3>
          <p>Try adjusting your search terms or filters</p>
          {products.length === 0 && (
            <button onClick={fetchProducts} className={styles.retryButton}>
              Reload Products
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
