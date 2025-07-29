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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dummyjson.com/products?limit=100");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const categoryMap = new Map<string, CategoryData>();

    products.forEach((product) => {
      const categoryName = product.category;
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
    });

    // Calculate additional data for each category
    categoryMap.forEach((category) => {
      // Calculate average price
      const totalPrice = category.products.reduce(
        (sum, product) => sum + product.price,
        0
      );
      category.averagePrice = totalPrice / category.products.length;

      // Get top brands
      const brandCounts = new Map<string, number>();
      category.products.forEach((product) => {
        brandCounts.set(
          product.brand,
          (brandCounts.get(product.brand) || 0) + 1
        );
      });
      category.topBrands = Array.from(brandCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([brand]) => brand);
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
            onClick={() =>
              navigate(
                `/products`
              )
            }
          >
            <div className={styles.categoryImage}>
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
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
                    {category.count} products
                  </span>
                </div>
              </div>

              <p className={styles.categoryDescription}>
                {category.description}
              </p>
{/* 
              <div className={styles.categoryStats}>
                <div className={styles.statItem}>
                  <TrendingUp className={styles.statItemIcon} />
                  <span>Avg. ${category.averagePrice.toFixed(0)}</span>
                </div>
                <div className={styles.statItem}>
                  <Star className={styles.statItemIcon} />
                  <span>
                    {(
                      category.products.reduce(
                        (sum, product) => sum + product.rating,
                        0
                      ) / category.products.length
                    ).toFixed(1)}
                  </span>
                </div>
              </div> */}

              {/* {category.topBrands.length > 0 && (
                <div className={styles.topBrands}>
                  <span className={styles.brandsLabel}>Top Brands:</span>
                  <div className={styles.brandsList}>
                    {category.topBrands.map((brand, index) => (
                      <span key={brand} className={styles.brandTag}>
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}

              <button
                className={styles.exploreButton}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/products`
                  );
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
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
