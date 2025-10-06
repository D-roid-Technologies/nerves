import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
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

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            image: thumbnail,
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

      setProducts(transformed);
      setFilteredProducts(transformed);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount and when listedItems or refreshTrigger changes
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger, listedItems]);

  const refreshProducts = () => {
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
            product.description?.toLowerCase().includes(query)
        );
        setHasSearched(true);
      } else {
        setHasSearched(false);
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
  }, [products, sortOption]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applySearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
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

  return (
    <div className="product-page">
      <div className="product-hero">
        <h1>Welcome To Nerves</h1>
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
            {searchQuery && (
              <button className="clear-search" onClick={clearSearch}>
                <X size={18} color="#666" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="product-container">
        <div className="product-listing">
          {hasSearched && searchQuery && (
            <div className="search-results-header">
              <h3>
                Showing results for "{searchQuery}"
                <button onClick={clearSearch} className="clear-all-filters">
                  Clear search
                </button>
              </h3>
            </div>
          )}

          {/* <div className="product-controls">
            <div className="results-info">
              <span>
                Showing {currentProducts.length} of {filteredProducts.length}{" "}
                products
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
            </div>
          </div> */}

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
              <button onClick={clearSearch} className="clear-filters-btn">
                Clear Search
              </button>
              <button onClick={refreshProducts} className="refresh-btn">
                Refresh Products
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {currentProducts.map((product) => (
                  <ProductCard
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
      <div style={{ marginTop: "-60px" }}>
        <Catergories />
        <Review />
        <NewProduct />
        <Footer />
      </div>
    </div>
  );
};

export default ProductPage;
