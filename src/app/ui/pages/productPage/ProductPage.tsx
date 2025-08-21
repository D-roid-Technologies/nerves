import React, { useState, useEffect } from "react";
import { Filter, Search, ChevronDown, ChevronUp, Star, X } from "lucide-react";
import ProductCard from "../../components/productCard/ProductCard";
import Pagination from "../../components/pagination/Pagination";
import Catergories from "../../components/catergories/Catergories";
import NewProduct from "../../components/newProduct/NewProduct";
import Review from "../../components/review/Review";
import Footer from "../../components/footer/Footer";

import "./ProductPage.css";

interface Product {
  id: number;
  name: string;
  price: number;
  slug?: string;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  description?: string;
  details?: string[];
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  category?: string;
  sellerId: string; // <- add this
}


const ProductPage = () => {
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
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();

        const transformed = data.products.map((product: any) => ({
          id: product.id,
          name: product.title,
          price: product.price,
          discountPrice: product.price * (1 - product.discountPercentage / 100),
          rating: product.rating,
          category: product.category,
          reviewCount: Math.floor(Math.random() * 1000),
          image: product.thumbnail,
          isNew: product.stock > 50,
          isFeatured: Math.random() > 0.7,
        }));

        setProducts(transformed);
        setFilteredProducts(transformed);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
            product.discountPrice?.toString().includes(query) ||
            product.price.toString().includes(query)
        );
        setHasSearched(true);
      } else {
        setHasSearched(false);
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
  const refreshPage = () => {
    window.location.reload();
  };
  const clearSearch = () => {
    refreshPage();
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

  const handleCategoryFilter = (category: string) => {
    setIsFiltering(true);
    setFilters({ ...filters, category });
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
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
              placeholder="Search products..."
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
        {/* Desktop Filters Sidebar */}
        {/* <div className="product-filters">
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
              {Array.from(new Set(products.map((p) => p.category))).map(
                (category) => (
                  <li key={category}>
                    <button
                      className={filters.category === category ? "active" : ""}
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: [
                      filters.priceRange[0],
                      parseInt(e.target.value),
                    ],
                  })
                }
              />
              <div className="price-values">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3>
              Rating
              {filters.rating > 0 && (
                <button onClick={() => setFilters({ ...filters, rating: 0 })}>
                  Clear
                </button>
              )}
            </h3>
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
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rating ? "currentColor" : "none"}
                      />
                    ))}
                  {rating}+
                </button>
              ))}
            </div>
          </div>
        </div> */}

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

          {/* Mobile Filter Navbar */}
          <div className="mobile-filter-nav">
            <div className="filter-nav-inner">
              <div className="filter-dropdown">
                <button
                  className={`filter-dropdown-toggle ${activeDropdown === "categories" ? "active" : ""
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
                          new Set(products.map((p) => p.category).filter((c): c is string => !!c))
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
                  </div>
                )}
              </div>

              <div className="filter-dropdown">
                <button
                  className={`filter-dropdown-toggle ${activeDropdown === "price" ? "active" : ""
                    }`}
                  onClick={() => toggleDropdown("price")}
                >
                  Price
                  <ChevronDown size={16} />
                </button>
                {activeDropdown === "price" && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-section">
                      <h3>Price Range</h3>
                      <div className="price-range">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              priceRange: [
                                filters.priceRange[0],
                                parseInt(e.target.value),
                              ],
                            })
                          }
                        />
                        <div className="price-values">
                          <span>${filters.priceRange[0]}</span>
                          <span>${filters.priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="filter-dropdown">
                <button
                  className={`filter-dropdown-toggle ${activeDropdown === "rating" ? "active" : ""
                    }`}
                  onClick={() => toggleDropdown("rating")}
                >
                  Rating
                  <ChevronDown size={16} />
                </button>
                {activeDropdown === "rating" && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-section">
                      <h3>Rating</h3>
                      <div className="rating-filter">
                        {[4, 3, 2, 1].map((rating) => (
                          <button
                            key={rating}
                            className={
                              filters.rating === rating ? "active" : ""
                            }
                            onClick={() => {
                              setFilters({
                                ...filters,
                                rating: filters.rating === rating ? 0 : rating,
                              });
                              setActiveDropdown(null);
                            }}
                          >
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  fill={i < rating ? "currentColor" : "none"}
                                />
                              ))}
                            {rating}+
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="filter-dropdown">
                <button
                  className={`filter-dropdown-toggle ${activeDropdown === "sort" ? "active" : ""
                    }`}
                  onClick={() => toggleDropdown("sort")}
                >
                  Sort By
                  <ChevronDown size={16} />
                </button>
                {activeDropdown === "sort" && (
                  <div className="filter-dropdown-menu">
                    <h4>Sort Options</h4>
                    <div className="filter-section">
                      <ul>
                        {[
                          { value: "featured", label: "Featured" },
                          { value: "price-low", label: "Price: Low to High" },
                          { value: "price-high", label: "Price: High to Low" },
                          { value: "rating", label: "Rating" },
                          { value: "newest", label: "Newest" },
                        ].map((option) => (
                          <li key={option.value}>
                            <button
                              className={
                                sortOption === option.value ? "active" : ""
                              }
                              onClick={() => {
                                setSortOption(option.value);
                                setActiveDropdown(null);
                              }}
                            >
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="product-controls">
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
            </div>
          ) : (
            <>
              <div className="product-grid">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      sellerId: product.sellerId || "000000", // ensure sellerId exists
                      category: product.category || "uncategorized", // ensure category exists
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
