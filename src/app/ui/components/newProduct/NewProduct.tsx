import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/slice/cart";
import styles from "./NewProduct.module.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../redux/configuration/auth.service";
import { RootState } from "../../../redux/store";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  discountPercentage: number;
  category: string;
  rating: number;
  name: string;
  reviewCount: number;
  image: string;
  sellerId: string;
  stock?: number;
  brand?: string;
  description?: string;
  images?: string[];
}

function NewProduct() {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const listedItems = useSelector(
    (state: RootState) => state.products.listedItems
  );

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Use Redux listedItems or fetch from Firestore
        const allItems =
          listedItems && listedItems.length > 0
            ? listedItems
            : await authService.fetchAllListedItems();

        console.log(
          "🔄 Raw Firestore items count for flash sale:",
          allItems.length
        );

        // Transform Firestore data to match Product interface
        const transformedProducts: Product[] = allItems
          .filter((product: any) => {
            // Filter for products with discount or new products
            return (
              (product.discountPercentage && product.discountPercentage > 0) ||
              product.isNew ||
              (product.stock && product.stock > 0)
            );
          })
          .slice(0, 8) // Limit to 8 products for the slider
          .map((product: any, index: number) => {
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

            // Handle name/title
            const title =
              product.title || product.name || `Product ${productId}`;
            const name = product.name || title;

            // Handle category
            const category = product.category?.toLowerCase() || "uncategorized";

            // Handle discount percentage - generate random if not available for flash sale effect
            const discountPercentage =
              product.discountPercentage ||
              (Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0);

            // Handle rating - generate random if not available
            const rating = product.rating || (Math.random() * 2 + 3).toFixed(1);

            return {
              id: productId,
              title: title,
              name: name,
              price: product.price ?? Math.floor(Math.random() * 500) + 50,
              discountPercentage: discountPercentage,
              category: category,
              rating: typeof rating === "number" ? rating : parseFloat(rating),
              reviewCount:
                product.reviewCount || Math.floor(Math.random() * 100),
              thumbnail: thumbnail,
              image: thumbnail,
              sellerId: sellerId,
              stock: product.stock ?? Math.floor(Math.random() * 100),
              brand: product.brand || "Unknown Brand",
              description:
                product.description || `High-quality ${category} product`,
              images: images,
            };
          });

        console.log(
          "✅ Transformed products for flash sale:",
          transformedProducts.length
        );

        // If we don't have enough discounted products, add some regular products
        if (transformedProducts.length < 4) {
          const regularProducts = allItems
            .filter(
              (product: any) =>
                !transformedProducts.some((p) => p.id === product.id)
            )
            .slice(0, 8 - transformedProducts.length)
            .map((product: any, index: number) => {
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

              const productId = product.id || Date.now() + index + 1000;
              const thumbnail =
                product.thumbnail || product.image || "/placeholder.svg";
              const title =
                product.title || product.name || `Product ${productId}`;
              const category =
                product.category?.toLowerCase() || "uncategorized";

              return {
                id: productId,
                title: title,
                name: title,
                price: product.price ?? Math.floor(Math.random() * 500) + 50,
                discountPercentage: Math.floor(Math.random() * 30) + 10, // Add discount for flash sale
                category: category,
                rating: product.rating || (Math.random() * 2 + 3).toFixed(1),
                reviewCount:
                  product.reviewCount || Math.floor(Math.random() * 100),
                thumbnail: thumbnail,
                image: thumbnail,
                sellerId: sellerId,
                stock: product.stock ?? Math.floor(Math.random() * 100),
                brand: product.brand || "Unknown Brand",
                description:
                  product.description || `High-quality ${category} product`,
                images: product.images || [],
              };
            });

          setProducts([...transformedProducts, ...regularProducts].slice(0, 8));
        } else {
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Error fetching products for flash sale:", error);
        // Fallback to empty array
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [listedItems]);

  // Clone first product to the end for seamless loop
  const extendedProducts =
    products.length > 0 ? [...products, products[0]] : [];

  // Auto-slide functionality
  useEffect(() => {
    if (products.length === 0 || isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => prev + 1);
      setIsTransitioning(true);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [products.length, isPaused]);

  // Handle seamless loop reset
  useEffect(() => {
    if (products.length === 0) return;

    if (current === products.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(0);
      }, 600);
      return () => clearTimeout(timeout);
    } else {
      setIsTransitioning(true);
    }
  }, [current, products.length]);

  // Manual navigation
  const goToSlide = (index: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrent(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToPrevious = () => {
    const newIndex = current === 0 ? products.length - 1 : current - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = current === products.length - 1 ? 0 : current + 1;
    goToSlide(newIndex);
  };

  const handleAddToCart = (product: Product) => {
    // Remove quantity and total from the product object before dispatching
    const { quantity, total, ...cartProduct } = product as any;

    dispatch(
      addToCart({
        ...cartProduct,
        sellerId: product.sellerId || "default-seller",
        name: product.name || product.title,
        reviewCount: product.reviewCount || 0,
        image: product.image || product.thumbnail,
      })
    );
  };

  const handleProductClick = (product: Product) => {
    navigate(`/shop/${product.id}`, {
      state: { product },
    });
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.promoPanel}>
            <div className={styles.promoPanelContent}>
              <div className={styles.flashIcon}>
                <Clock size={32} />
              </div>
              <h1>Flash Sale</h1>
              <p>Limited time offers on premium products!</p>
              <div className={styles.countdown}>
                <div className={styles.countdownItem}>
                  <span>02</span>
                  <small>Hours</small>
                </div>
                <div className={styles.countdownItem}>
                  <span>45</span>
                  <small>Minutes</small>
                </div>
                <div className={styles.countdownItem}>
                  <span>33</span>
                  <small>Seconds</small>
                </div>
              </div>
              <button
                className={styles.ctaButton}
                onClick={() => navigate("/shop")}
              >
                <ShoppingBag size={16} />
                Shop Now
              </button>
            </div>
          </div>
          <div className={styles.sliderWrapper}>
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <p>Loading amazing deals...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no products available
  if (products.length === 0 && !loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.promoPanel}>
            <div className={styles.promoPanelContent}>
              <div className={styles.flashIcon}>
                <Clock size={32} />
              </div>
              <h1>Flash Sale</h1>
              <p>Limited time offers on premium products!</p>
              <div className={styles.countdown}>
                <div className={styles.countdownItem}>
                  <span>02</span>
                  <small>Hours</small>
                </div>
                <div className={styles.countdownItem}>
                  <span>45</span>
                  <small>Minutes</small>
                </div>
                <div className={styles.countdownItem}>
                  <span>33</span>
                  <small>Seconds</small>
                </div>
              </div>
              <button
                className={styles.ctaButton}
                onClick={() => navigate("/shop")}
              >
                <ShoppingBag size={16} />
                Shop All Products
              </button>
            </div>
          </div>
          <div className={styles.sliderWrapper}>
            <div className={styles.noProducts}>
              <h3>No flash sale products available</h3>
              <p>Check back later for amazing deals!</p>
              <button
                className={styles.ctaButton}
                onClick={() => navigate("/shop")}
              >
                <ShoppingBag size={16} />
                Browse All Products
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.promoPanel}>
          <div className={styles.promoPanelContent}>
            <div className={styles.flashIcon}>
              <Clock size={32} />
            </div>
            <h1>Flash Sale</h1>
            <p>Limited time offers on premium products!</p>
            <div className={styles.countdown}>
              <div className={styles.countdownItem}>
                <span>02</span>
                <small>Hours</small>
              </div>
              <div className={styles.countdownItem}>
                <span>45</span>
                <small>Minutes</small>
              </div>
              <div className={styles.countdownItem}>
                <span>33</span>
                <small>Seconds</small>
              </div>
            </div>
            <button
              className={styles.ctaButton}
              onClick={() => navigate("/shop")}
            >
              <ShoppingBag size={16} />
              Shop Now
            </button>
          </div>
          <div className={styles.decorativeElements}>
            <div className={styles.floatingElement}></div>
            <div className={styles.floatingElement}></div>
            <div className={styles.floatingElement}></div>
          </div>
        </div>

        <div className={styles.sliderWrapper}>
          <button
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            onClick={goToPrevious}
            disabled={products.length <= 1}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={sliderRef}
            className={styles.slider}
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: isTransitioning
                ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none",
            }}
          >
            {extendedProducts.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className={styles.slide}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${product.thumbnail})`,
                }}
                onClick={() => handleProductClick(product)}
              >
                <div className={styles.productOverlay}>
                  <div className={styles.productBadge}>
                    {Math.round(product.discountPercentage)}% OFF
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.categoryTag}>
                      {product.category?.charAt(0).toUpperCase() +
                        product.category?.slice(1)}
                    </div>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <div className={styles.productRating}>
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={
                              i < Math.floor(product.rating)
                                ? "#FFD700"
                                : "transparent"
                            }
                            stroke={
                              i < Math.floor(product.rating)
                                ? "#FFD700"
                                : "#ccc"
                            }
                          />
                        ))}
                      </div>
                      <span className={styles.ratingValue}>
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>
                    <div className={styles.productPricing}>
                      <span className={styles.discountPrice}>
                        ₦
                        {(
                          product.price *
                          (1 - product.discountPercentage / 100)
                        ).toFixed(0)}
                      </span>
                      <span className={styles.originalPrice}>
                        ₦{product.price.toFixed(0)}
                      </span>
                    </div>
                    <button
                      className={styles.productButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingBag size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className={`${styles.navButton} ${styles.navButtonRight}`}
            onClick={goToNext}
            disabled={products.length <= 1}
          >
            <ChevronRight size={20} />
          </button>

          {products.length > 1 && (
            <div className={styles.slideIndicators}>
              {products.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.indicator} ${
                    idx === current % products.length ? styles.active : ""
                  }`}
                  onClick={() => goToSlide(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewProduct;
