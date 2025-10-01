import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ChevronLeft, Heart, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slice/cart";
import "./ProductDetailsPage.css";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../../../redux/configuration/auth.service";
import DeleteProductButton from "../deleteProductButton/DeleteProductButton";
// import { auth } from "../../../firebase";

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
  sellerId?: string;
}

const ProductDetailsPageAlt = () => {
  const { productTitle } = useParams<{ productTitle: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isOwner, setIsOwner] = useState(false);

//   useEffect(() => {
//     const checkOwnership = async () => {
//       const currentUser = auth.currentUser;
//       if (currentUser && product) {
//         const userEmail = currentUser.email;
//         setIsOwner(product.sellerId === userEmail);
//       }
//     };

//     checkOwnership();
//   }, [product]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        console.log("🔄 Starting product fetch for:", productTitle);

        // Fetch all items from Firestore
        const allItems = await authService.fetchAllListedItems();
        console.log("📦 Total items from Firestore:", allItems.length);

        if (allItems.length === 0) {
          console.log("❌ No items found in Firestore");
          navigate("/not-found");
          return;
        }

        // Log all available items for debugging
        console.log(
          "📝 All available items:",
          allItems.map((item: any, index: number) => ({
            index,
            title: item.title,
            name: item.name,
            id: item.id,
            sellerId: item.sellerId,
            generatedSlug: (
              item.title ||
              item.name ||
              `product-${item.id || index}`
            )
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9\-]/g, ""),
          }))
        );

        // Find the product by matching the slug with multiple strategies
        const foundProduct = allItems.find((item: any, index: number) => {
          // Try multiple strategies to generate the slug
          const strategies = [
            item.title,
            item.name,
            `product-${item.id}`,
            `product-${index}`,
          ];

          for (const strategy of strategies) {
            if (strategy) {
              const itemSlug = strategy
                .toString()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, "");

              console.log("🔍 Comparing:", {
                strategy,
                itemSlug,
                productTitle,
                matches: itemSlug === productTitle,
              });

              if (itemSlug === productTitle) {
                console.log(`✅ Match found using strategy: ${strategy}`);
                return true;
              }
            }
          }

          return false;
        });

        if (foundProduct) {
          console.log("🎉 Found product in Firestore:", foundProduct);

          // Handle sellerId - extract email if it's an object
          let sellerId = "Unknown Seller";
          if (foundProduct.sellerId) {
            if (typeof foundProduct.sellerId === "object") {
              sellerId =
                foundProduct.sellerId.email ||
                foundProduct.sellerId.name ||
                "Unknown Seller";
            } else {
              sellerId = foundProduct.sellerId;
            }
          }

          const transformedProduct: Product = {
            id: foundProduct.id || Date.now(),
            name: foundProduct.title || foundProduct.name || "Unknown Product",
            slug: (
              foundProduct.title ||
              foundProduct.name ||
              `product-${foundProduct.id}`
            )
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9\-]/g, ""),
            price: foundProduct.price || 0,
            discountPrice:
              foundProduct.discountPrice ||
              (foundProduct.price && foundProduct.discountPercentage
                ? foundProduct.price *
                  (1 - foundProduct.discountPercentage / 100)
                : undefined),
            rating: foundProduct.rating || 0,
            reviewCount:
              foundProduct.reviewCount || Math.floor(Math.random() * 100) + 10,
            image: foundProduct.thumbnail || foundProduct.image || "",
            category: foundProduct.category || "uncategorized",
            description:
              foundProduct.description || "No description available.",
            details: [
              `Brand: ${foundProduct.brand || "Unknown"}`,
              `Stock: ${foundProduct.stock || 0} available`,
              `Rating: ${foundProduct.rating || 0} stars`,
              `Category: ${foundProduct.category || "uncategorized"}`,
            ],
            discountPercentage: foundProduct.discountPercentage,
            images: foundProduct.images || [
              foundProduct.thumbnail || foundProduct.image || "",
            ],
            isNew: foundProduct.isNew || Math.random() > 0.5,
            isFeatured: foundProduct.isFeatured || Math.random() > 0.7,
            sellerId: sellerId,
          };

          setProduct(transformedProduct);
          console.log(
            "✅ Product transformed successfully:",
            transformedProduct
          );
        } else {
          console.log("❌ Product not found in Firestore after all strategies");
          console.log(
            "🔍 Available slugs:",
            allItems.map((item: any, index: number) => ({
              title: item.title,
              name: item.name,
              slug: (item.title || item.name || `product-${item.id || index}`)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, ""),
            }))
          );
          navigate("/not-found");
        }
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productTitle, navigate]);

  const productImages = product?.images?.length
    ? product.images
    : product?.image
    ? [product.image]
    : [
        "https://via.placeholder.com/600x600?text=No+Image+Available",
        "https://via.placeholder.com/600x600?text=Product+2",
        "https://via.placeholder.com/600x600?text=Product+3",
      ];

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart(
          {
            ...product,
            sellerId: product.sellerId || "000000",
          },
          quantity
        )
      );
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
    const hasDecimals = price % 1 !== 0;

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
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
        <button onClick={() => navigate("/shop")} className="back-to-products">
          Browse All Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Debug info - remove in production */}
      {/* <div
        style={{
          padding: "8px 16px",
          backgroundColor: "#e3f2fd",
          color: "#1565c0",
          borderRadius: "4px",
          marginBottom: "16px",
          fontSize: "12px",
          display: "inline-block",
        }}
      >
      </div> */}

      <button
        className="back-button"
        onClick={() => navigate(`/shop`)}
        aria-label="Back to products"
      >
        <ChevronLeft size={20} />
        Back to Products
      </button>
{/* 
      {isOwner && (
        <DeleteProductButton
          productId={product.id}
          productName={product.name}
          onDeleteSuccess={() => navigate("/shop")}
        />F
      )} */}
      <div className="product-container">
        {/* Product Images Gallery */}
        <div className="product-images">
          <div className="thumbnail-images">
            {productImages.map((img, index) => (
              <button
                key={index}
                className={`thumbnail-btn ${
                  selectedImage === index ? "active" : ""
                }`}
                onClick={() => setSelectedImage(index)}
                aria-label={`View product image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="thumbnail-img"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback for broken images
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/150x150?text=Image+Error";
                  }}
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
              onError={(e) => {
                // Fallback for broken main image
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/600x600?text=Product+Image";
              }}
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
            {product.sellerId && product.sellerId !== "Unknown Seller" && (
              <div className="meta-item">
                <span className="meta-label">Seller:</span>
                <span className="meta-value">{product.sellerId}</span>
              </div>
            )}
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
    </div>
  );
};

export default ProductDetailsPageAlt;
