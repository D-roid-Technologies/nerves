import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slice/cart";
import styles from "./NewProduct.module.css";
import { useNavigate } from "react-router-dom";

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

  // Fetch products from DummyJSON API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/products?limit=8");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    dispatch(
      addToCart({
        ...product,
        sellerId: "default-seller",
        name: product.name ?? product.title,
        reviewCount: product.reviewCount ?? 0,
        image: product.image ?? product.thumbnail,
      })
    );
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
              <button className={styles.ctaButton}>
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
              onClick={() => navigate("/products")}
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
              >
                <div className={styles.productOverlay}>
                  <div className={styles.productBadge}>
                    {Math.round(product.discountPercentage)}% OFF
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.categoryTag}>{product.category}</div>
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
                        ({product.rating})
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
                        ₦{product.price}
                      </span>
                    </div>
                    <button
                      className={styles.productButton}
                      onClick={() => handleAddToCart(product)}
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
          >
            <ChevronRight size={20} />
          </button>

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
        </div>
      </div>
    </section>
  );
}

export default NewProduct;
