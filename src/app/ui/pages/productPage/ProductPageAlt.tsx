import React, { useState, useEffect } from "react";
import {
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  RefreshCw,
} from "lucide-react";
import ProductCard from "../../components/productCard/ProductCard";
import Pagination from "../../components/pagination/Pagination";
import Catergories from "../../components/catergories/Catergories";
import NewProduct from "../../components/newProduct/NewProduct";
import Review from "../../components/review/Review";
import Footer from "../../components/footer/Footer";

import "./ProductPage.css";
import { authService } from "../../../redux/configuration/auth.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import ProductCardAlt from "../../components/productCard/ProductCardAlt";

export interface Product {
  id: number;
  name: string;
  price: number;
  slug?: string;
  discountPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount?: number;
  description?: string;
  details?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  category?: string;
  sellerId: string;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
}

const ProductPageAlt = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    rating: 0,
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const listedItems = useSelector(
    (state: RootState) => state.products.listedItems
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const allItems =
        listedItems && listedItems.length > 0
          ? listedItems
          : await authService.fetchAllListedItems();

      console.log("🔄 Raw Firestore items count:", allItems.length);
      console.log("🔍 All items:", allItems);

      const transformed: Product[] = allItems.map(
        (product: any, index: number) => {
          // Handle sellerId - extract email if it's an object
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

          // Use the actual ID from Firestore, not just the index
          const productId = product.id || Date.now() + index;

          // Handle images - ensure we have a proper array
          let images = product.images || [];
          if (!Array.isArray(images)) {
            images = [];
          }

          // Handle thumbnail - use image if thumbnail is not available
          const thumbnail = product.thumbnail || product.image || "";

          // Handle name/title
          const name = product.title || product.name || `Product ${productId}`;

          // Generate slug
          const slug = (product.title || product.name || `product-${productId}`)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

          console.log(`📦 Transforming product ${index}:`, {
            id: productId,
            name: name,
            thumbnail: thumbnail ? "Has thumbnail" : "No thumbnail",
            imagesCount: images.length,
            slug: slug,
          });

          return {
            id: productId,
            name: name,
            price: product.price ?? 0,
            discountPrice:
              product.price && product.discountPercentage
                ? product.price * (1 - product.discountPercentage / 100)
                : undefined,
            discountPercentage: product.discountPercentage || 0,
            rating: product.rating ?? 0,
            category: product.category ?? "uncategorized",
            reviewCount: product.reviewCount || Math.floor(Math.random() * 100),
            image: thumbnail, // Use thumbnail for the main image
            isNew: product.isNew || (product.stock ?? 0) > 50,
            sellerId: sellerId,
            stock: product.stock ?? 0,
            brand: product.brand ?? "Unknown",
            thumbnail: thumbnail,
            images: images,
            slug: slug,
            description: product.description || "",
          };
        }
      );

      console.log("✅ Transformed products count:", transformed.length);
      console.log("📋 Transformed products:", transformed);

      setProducts(transformed);
      setFilteredProducts(transformed);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch products on mount and when listedItems or refreshTrigger changes
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger, listedItems]);

  const refreshProducts = () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const applySearch = () => {
    setIsFiltering(true);
    setTimeout(() => {
      let result = [...products];

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query) ||
            product.brand?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.discountPrice?.toString().includes(query) ||
            product.price.toString().includes(query)
        );
      }

      // Apply other filters
      if (filters.category) {
        result = result.filter(
          (product) => product.category === filters.category
        );
      }
      result = result.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      );
      if (filters.rating > 0) {
        result = result.filter((product) => product.rating >= filters.rating);
      }

      // Apply sorting
      switch (sortOption) {
        case "price-low":
          result.sort(
            (a, b) =>
              (a.discountPrice || a.price) - (b.discountPrice || b.price)
          );
          break;
        case "price-high":
          result.sort(
            (a, b) =>
              (b.discountPrice || b.price) - (a.discountPrice || a.price)
          );
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          result.sort((a, b) => b.id - a.id);
          break;
        default:
          result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
      }

      setFilteredProducts(result);
      setCurrentPage(1);
      setIsFiltering(false);
    }, 500);
  };

  useEffect(() => {
    applySearch();
  }, [products, filters, sortOption]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applySearch();
    }
  };

  const handleSearchSubmit = () => {
    applySearch();
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryFilter = (category: string) => {
    setIsFiltering(true);
    setFilters({ ...filters, category });
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const clearAllFilters = () => {
    setFilters({
      category: "",
      priceRange: [0, 1000],
      rating: 0,
    });
    setSearchQuery("");
    setSortOption("featured");
  };

  return (
    <div className="product-page">
      <div className="product-hero-alt product-hero">
        <h1>Our Products</h1>
        <p>Discover our premium products</p>
        <div className="search-container">
          <div className="search-bar">
            <Search size={18} color="#666" />
            <input
              type="text"
              placeholder="Search products, then hit enter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
            {/* <button
              onClick={handleSearchSubmit}
              className="search-submit-btn"
              disabled={isFiltering}
            >
              Search
            </button> */}
          </div>
        </div>
      </div>
      <div className="product-container">
        {/* Desktop Filters Sidebar */}
        <div className="product-filters">
          <div className="filter-header">
            {/* <button
              onClick={refreshProducts}
              className="refresh-btn"
              disabled={refreshing}
              title="Refresh products"
            >
              <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button> */}
          </div>

          <div className="filter-section">
            <h3>
              Categories
              {filters.category && (
                <button onClick={() => handleCategoryFilter("")}>Clear</button>
              )}
            </h3>
            <ul>
              <li>
                <button
                  className={!filters.category ? "active" : ""}
                  onClick={() => handleCategoryFilter("")}
                >
                  All
                </button>
              </li>
              {Array.from(
                new Set(
                  products
                    .map((p) => p.category)
                    .filter((c): c is string => !!c)
                )
              ).map((category) => (
                <li key={category}>
                  <button
                    className={filters.category === category ? "active" : ""}
                    onClick={() => {
                      handleCategoryFilter(category);
                      setActiveDropdown(null);
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          {/* <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range">
              <span>₦{filters.priceRange[0]}</span>
              <span>₦{filters.priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [0, parseInt(e.target.value)],
                })
              }
              className="price-slider"
            />
          </div> */}

          {/* Rating Filter */}
          {/* <div className="filter-section">
            <h3>Minimum Rating</h3>
            <div className="rating-filter">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  className={filters.rating === rating ? "active" : ""}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      rating: filters.rating === rating ? 0 : rating,
                    })
                  }
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < rating ? "currentColor" : "none"}
                    />
                  ))}
                  <span>& up</span>
                </button>
              ))}
            </div>
          </div> */}

          {/* Clear All Filters */}
          {(filters.category ||
            filters.rating > 0 ||
            filters.priceRange[1] < 1000 ||
            searchQuery) && <div className="filter-section"></div>}
        </div>

        <div className="product-listing">
          {/* Mobile Filter Navbar */}
          <div className="mobile-filter-nav">
            <div className="filter-nav-inner">
              <div className="filter-dropdown">
                <button
                  className={`filter-dropdown-toggle ${
                    activeDropdown === "categories" ? "active" : ""
                  }`}
                  onClick={() => toggleDropdown("categories")}
                >
                  Categories
                  <ChevronDown size={16} />
                </button>
                {activeDropdown === "categories" && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-section">
                      <h3>Categories</h3>
                      <ul>
                        <li>
                          <button
                            className={!filters.category ? "active" : ""}
                            onClick={() => {
                              handleCategoryFilter("");
                              setActiveDropdown(null);
                            }}
                          >
                            All
                          </button>
                        </li>
                        {Array.from(
                          new Set(
                            products
                              .map((p) => p.category)
                              .filter((c): c is string => !!c)
                          )
                        ).map((category) => (
                          <li key={category}>
                            <button
                              className={
                                filters.category === category ? "active" : ""
                              }
                              onClick={() => {
                                handleCategoryFilter(category);
                                setActiveDropdown(null);
                              }}
                            >
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Other mobile filter dropdowns would go here */}
            </div>
          </div>

          <div className="product-controls">
            <div className="results-info">
              <span>
                Showing {currentProducts.length} of {filteredProducts.length}{" "}
                products
                {filters.category && ` in ${filters.category}`}
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            </div>

            <div className="sort-options">
              <span>Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>

              <button
                onClick={refreshProducts}
                className="refresh-btn-mobile"
                disabled={refreshing}
                title="Refresh products"
              >
                <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="skeleton-grid">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line medium"></div>
                    <div className="skeleton-line long"></div>
                    <div
                      className="skeleton-line short"
                      style={{ marginTop: "10px" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isFiltering ? (
            <div className="skeleton-grid">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line medium"></div>
                    <div className="skeleton-line long"></div>
                    <div
                      className="skeleton-line short"
                      style={{ marginTop: "10px" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <p>Total products in database: {products.length}</p>
              {/* <button onClick={clearAllFilters} className="clear-filters-btn">
                Clear All Filters
              </button> */}
              <button onClick={refreshProducts} className="refresh-btn">
                Refresh Products
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {currentProducts.map((product) => (
                  <ProductCardAlt
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      discountPrice: product.discountPrice,
                      discountPercentage: product.discountPercentage,
                      rating: product.rating,
                      category: product.category || "uncategorized",
                      reviewCount: product.reviewCount ?? 0,
                      image: product.thumbnail,
                      isNew: product.isNew ?? false,
                      sellerId: product.sellerId || "unknown@example.com",
                      total: product.price,
                      slug: product.slug,
                      description: product.description,
                      brand: product.brand,
                      stock: product.stock,
                      images: product.images,
                    }}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPageAlt;
