import React, { useState, useEffect } from "react";
import { Filter, Search, ChevronDown, ChevronUp, Star } from "lucide-react";
import ProductCard from "../../components/productCard/ProductCard";
import Pagination from "../../components/pagination/Pagination";
import "./ProductPage.css";

interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  isNew: boolean;
  isFeatured: boolean;
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, you would fetch from an API
        const mockProducts: Product[] = [
          {
            id: 1,
            name: "Premium Leather Watch",
            price: 249.99,
            discountPrice: 199.99,
            rating: 4.5,
            reviewCount: 128,
            image:
              "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1170&auto=format&fit=crop",
            category: "watches",
            isNew: true,
            isFeatured: true,
          },
          {
            id: 2,
            name: "Classic White Sneakers",
            price: 129.99,
            discountPrice: 99.99,
            rating: 4.8,
            reviewCount: 305,
            image:
              "https://images.unsplash.com/photo-1606813902612-b4239e2f2ac9?q=80&w=1170&auto=format&fit=crop",
            category: "shoes",
            isNew: false,
            isFeatured: true,
          },
          {
            id: 3,
            name: "Vintage Denim Jacket",
            price: 89.99,
            discountPrice: 69.99,
            rating: 4.3,
            reviewCount: 210,
            image:
              "https://images.unsplash.com/photo-1593032465171-8e6f07efb25b?q=80&w=1170&auto=format&fit=crop",
            category: "clothing",
            isNew: true,
            isFeatured: false,
          },
          {
            id: 4,
            name: "Luxury Perfume",
            price: 149.99,
            discountPrice: 129.99,
            rating: 4.7,
            reviewCount: 98,
            image:
              "https://images.unsplash.com/photo-1618354691390-0185b280f519?q=80&w=1170&auto=format&fit=crop",
            category: "fragrance",
            isNew: true,
            isFeatured: true,
          },
          {
            id: 5,
            name: "Stylish Sunglasses",
            price: 59.99,
            discountPrice: 49.99,
            rating: 4.2,
            reviewCount: 76,
            image:
              "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1170&auto=format&fit=crop",
            category: "accessories",
            isNew: false,
            isFeatured: false,
          },
          {
            id: 6,
            name: "Bluetooth Earbuds",
            price: 89.99,
            discountPrice: 69.99,
            rating: 4.6,
            reviewCount: 320,
            image:
              "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1170&auto=format&fit=crop",
            category: "electronics",
            isNew: true,
            isFeatured: true,
          },
          {
            id: 7,
            name: "Modern Office Chair",
            price: 299.99,
            discountPrice: 249.99,
            rating: 4.9,
            reviewCount: 145,
            image:
              "https://images.unsplash.com/photo-1598300053181-8466b437c0f1?q=80&w=1170&auto=format&fit=crop",
            category: "furniture",
            isNew: true,
            isFeatured: true,
          },
          {
            id: 8,
            name: "Leather Backpack",
            price: 179.99,
            discountPrice: 149.99,
            rating: 4.4,
            reviewCount: 88,
            image:
              "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1170&auto=format&fit=crop",
            category: "bags",
            isNew: false,
            isFeatured: false,
          },
          {
            id: 9,
            name: "Smart Fitness Band",
            price: 99.99,
            discountPrice: 79.99,
            rating: 4.5,
            reviewCount: 200,
            image:
              "https://images.unsplash.com/photo-1603791452906-c0e7c74be3c5?q=80&w=1170&auto=format&fit=crop",
            category: "wearables",
            isNew: true,
            isFeatured: true,
          },
          {
            id: 10,
            name: "Cotton Crew T-Shirt",
            price: 29.99,
            discountPrice: 19.99,
            rating: 4.1,
            reviewCount: 67,
            image:
              "https://images.unsplash.com/photo-1581574203976-1e6adf6f39c6?q=80&w=1170&auto=format&fit=crop",
            category: "clothing",
            isNew: true,
            isFeatured: false,
          },
          {
            id: 11,
            name: "Elegant Handbag",
            price: 199.99,
            discountPrice: 179.99,
            rating: 4.6,
            reviewCount: 110,
            image:
              "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1170&auto=format&fit=crop",
            category: "bags",
            isNew: false,
            isFeatured: true,
          },
          {
            id: 12,
            name: "Wireless Charging Pad",
            price: 39.99,
            discountPrice: 29.99,
            rating: 4.3,
            reviewCount: 134,
            image:
              "https://images.unsplash.com/photo-1611801804439-01966f1ab4d3?q=80&w=1170&auto=format&fit=crop",
            category: "electronics",
            isNew: true,
            isFeatured: false,
          },
          {
            id: 13,
            name: "Gaming Headset",
            price: 149.99,
            discountPrice: 129.99,
            rating: 4.8,
            reviewCount: 410,
            image:
              "https://images.unsplash.com/photo-1623268432217-76a05b6c58b1?q=80&w=1170&auto=format&fit=crop",
            category: "electronics",
            isNew: false,
            isFeatured: true,
          },
          {
            id: 14,
            name: "Elegant Table Lamp",
            price: 59.99,
            discountPrice: 45.99,
            rating: 4.4,
            reviewCount: 90,
            image:
              "https://images.unsplash.com/photo-1621428914527-cd3a85a4a9b2?q=80&w=1170&auto=format&fit=crop",
            category: "home",
            isNew: false,
            isFeatured: false,
          },
          {
            id: 15,
            name: "Casual Hoodie",
            price: 49.99,
            discountPrice: 39.99,
            rating: 4.5,
            reviewCount: 220,
            image:
              "https://images.unsplash.com/photo-1579613832124-6be203f4b68f?q=80&w=1170&auto=format&fit=crop",
            category: "clothing",
            isNew: true,
            isFeatured: true,
          },
          {
            id: 16,
            name: "Stainless Steel Water Bottle",
            price: 19.99,
            discountPrice: 14.99,
            rating: 4.7,
            reviewCount: 180,
            image:
              "https://images.unsplash.com/photo-1601918774946-25832daed10b?q=80&w=1170&auto=format&fit=crop",
            category: "fitness",
            isNew: true,
            isFeatured: false,
          },
          {
            id: 17,
            name: "Smartphone Gimbal",
            price: 109.99,
            discountPrice: 89.99,
            rating: 4.6,
            reviewCount: 95,
            image:
              "https://images.unsplash.com/photo-1611839270957-d6683bcbc8fd?q=80&w=1170&auto=format&fit=crop",
            category: "photography",
            isNew: false,
            isFeatured: true,
          },
          {
            id: 18,
            name: "Wireless Keyboard",
            price: 69.99,
            discountPrice: 54.99,
            rating: 4.4,
            reviewCount: 140,
            image:
              "https://images.unsplash.com/photo-1587202372775-98973f4e4c9a?q=80&w=1170&auto=format&fit=crop",
            category: "electronics",
            isNew: true,
            isFeatured: true,
          },
          {
            id: 19,
            name: "Minimalist Wall Clock",
            price: 39.99,
            discountPrice: 29.99,
            rating: 4.2,
            reviewCount: 60,
            image:
              "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1170&auto=format&fit=crop",
            category: "home",
            isNew: false,
            isFeatured: false,
          },
          {
            id: 20,
            name: "Linen Throw Blanket",
            price: 79.99,
            discountPrice: 59.99,
            rating: 4.5,
            reviewCount: 122,
            image:
              "https://images.unsplash.com/photo-1616595526840-6f1a4bc0db9c?q=80&w=1170&auto=format&fit=crop",
            category: "home",
            isNew: true,
            isFeatured: false,
          },
        ];

        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }

    // Apply price filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter((product) => product.rating >= filters.rating);
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case "price-high":
        result.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Assuming newer products have higher IDs
        result.sort((a, b) => b.id - a.id);
        break;
      default: // "featured"
        result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchQuery, sortOption, filters]);

  // Get current products for pagination
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
      {/* Hero Section */}
      <div className="product-hero">
        <h1>Our Products</h1>
        <p>Discover our premium collection</p>
      </div>

      {/* Main Content */}
      <div className="product-container">
        {/* Sidebar Filters */}
        <div className={`product-filters ${showFilters ? "show" : ""}`}>
          <div className="filter-section">
            <h3>Categories</h3>
            <ul>
              <li>
                <button
                  onClick={() => setFilters({ ...filters, category: "" })}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    setFilters({ ...filters, category: "watches" })
                  }
                >
                  Watches
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    setFilters({ ...filters, category: "electronics" })
                  }
                >
                  Electronics
                </button>
              </li>
              {/* Add more categories */}
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
            <h3>Rating</h3>
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
        </div>

        {/* Product Listing */}
        <div className="product-listing">
          {/* Search and Sort Bar */}
          <div className="product-controls">
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

            <button
              className="mobile-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
              {showFilters ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
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
    </div>
  );
};

export default ProductPage;
