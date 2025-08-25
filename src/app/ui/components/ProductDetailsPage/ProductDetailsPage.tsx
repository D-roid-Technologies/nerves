import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ChevronLeft, Heart, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slice/cart";
import "./ProductDetailsPage.css";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  description?: string;
  details?: string[];
  discountPercentage?: number;
  brand?: string;
  stock?: number;
  images?: string[];
}

const ProductDetailsPage = () => {
  const { productTitle } = useParams<{ productTitle: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const productWithSeller = { ...product, sellerId: "12345" };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // First fetch all products
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();

        // Find the product by matching the title
        const foundProduct = data.products.find(
          (p: any) =>
            p.title.toLowerCase().replace(/\s+/g, "-") === productTitle
        );

        if (foundProduct) {
          const transformedProduct: Product = {
            id: foundProduct.id,
            name: foundProduct.title,
            slug: foundProduct.title.toLowerCase().replace(/\s+/g, "-"),
            price: foundProduct.price,
            discountPrice:
              foundProduct.price -
              (foundProduct.price * (foundProduct.discountPercentage || 0)) /
              100,
            rating: foundProduct.rating,
            reviewCount: Math.floor(Math.random() * 100) + 10,
            image: foundProduct.thumbnail,
            category: foundProduct.category,
            description: foundProduct.description,
            details: [
              `Brand: ${foundProduct.brand || "Unknown"}`,
              `Stock: ${foundProduct.stock || 0} available`,
              `Rating: ${foundProduct.rating} stars`,
              `Category: ${foundProduct.category}`,
            ],
            discountPercentage: foundProduct.discountPercentage,
            images: foundProduct.images || [],
            isNew: Math.random() > 0.5,
            isFeatured: Math.random() > 0.7,
          };
          setProduct(transformedProduct);
        } else {
          navigate("/not-found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productTitle, navigate]);

  const productImages = product?.images?.length
    ? product.images
    : [
      product?.image || "",
      "https://via.placeholder.com/600x600?text=Product+2",
      "https://via.placeholder.com/600x600?text=Product+3",
      "https://via.placeholder.com/600x600?text=Product+4",
    ];

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, sellerId: "000000" }, quantity));
      toast.success(`Added ${product.name} to your cart.`, {
        style: { background: "#4BB543", color: "#fff" },
        duration: 5000,
      });
    }
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product Not Found</h2>
        <p>
          The product you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="back-to-products"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Toaster position="top-center" reverseOrder={false} />
      <button
        className="back-button"
        onClick={() => navigate(`/products`)}
        aria-label="Back to products"
      >
        <ChevronLeft size={20} />
        Back to Products
      </button>

      <div className="product-container">
        {/* Product Images Gallery */}
        <div className="product-images">
          <div className="thumbnail-images">
            {productImages.map((img, index) => (
              <button
                key={index}
                className={`thumbnail-btn ${selectedImage === index ? "active" : ""
                  }`}
                onClick={() => setSelectedImage(index)}
                aria-label={`View product image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="thumbnail-img"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
          <div className="main-image-container">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="main-image"
              loading="eager"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            <button
              className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="product-rating">
            <div
              className="stars"
              aria-label={`Rating: ${product.rating} out of 5`}
            >
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={
                      i < Math.floor(product.rating) ? "currentColor" : "none"
                    }
                  />
                ))}
            </div>
            <span className="review-count">
              ({product.reviewCount} customer reviews)
            </span>
            {product.isNew && (
              <span className="new-badge" aria-label="New product">
                New
              </span>
            )}
          </div>

          <div className="product-pricing">
            {product.discountPrice ? (
              <>
                <span className="discounted-price">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="original-price">
                  {formatPrice(product.price)}
                </span>
                <span className="discount-percentage">
                  {Math.round(
                    ((product.price - product.discountPrice) / product.price) *
                    100
                  )}
                  % OFF
                </span>
              </>
            ) : (
              <span className="price">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>

          <div className="product-details">
            <h2>Product Details</h2>
            <ul>
              {product.details?.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span aria-label="Current quantity">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Availability:</span>
              <span className="meta-value in-stock">
                {product.stock && product.stock > 0
                  ? `In Stock (${product.stock} items)`
                  : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <section className="product-reviews" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading">Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="average-score">{product.rating.toFixed(1)}</span>
            <div className="stars">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={
                      i < Math.floor(product.rating) ? "currentColor" : "none"
                    }
                  />
                ))}
            </div>
            <span className="review-count">{product.reviewCount} reviews</span>
          </div>
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="rating-bar">
                <span className="star-count">{stars} star</span>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      width: `${(stars / 5) * 100}%`,
                    }}
                    aria-hidden="true"
                  ></div>
                </div>
                <span className="review-count">
                  {Math.floor((stars / 5) * product.reviewCount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Reviews */}
        <div className="review-list">
          <article className="review">
            <header className="review-header">
              <span className="reviewer">John D.</span>
              <div
                className="review-rating"
                aria-label="Rated 4 out of 5 stars"
              >
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < 4 ? "currentColor" : "none"}
                    />
                  ))}
              </div>
            </header>
            <h3 className="review-title">Great Product!</h3>
            <div className="review-body">
              <p>
                This product exceeded my expectations. The quality is amazing
                and it's very comfortable to use. Highly recommend!
              </p>
            </div>
            <footer className="review-date">Posted on March 15, 2023</footer>
          </article>

          <article className="review">
            <header className="review-header">
              <span className="reviewer">Sarah M.</span>
              <div
                className="review-rating"
                aria-label="Rated 5 out of 5 stars"
              >
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < 5 ? "currentColor" : "none"}
                    />
                  ))}
              </div>
            </header>
            <h3 className="review-title">Perfect!</h3>
            <div className="review-body">
              <p>
                Exactly what I was looking for. The shipping was fast and the
                product arrived in perfect condition.
              </p>
            </div>
            <footer className="review-date">Posted on February 28, 2023</footer>
          </article>
        </div>

        <button className="view-all-reviews">View All Reviews</button>
      </section>

      {/* Related Products Section - Removed since we can't fetch related products from DummyJSON easily */}
    </div>
  );
};

export default ProductDetailsPage;
