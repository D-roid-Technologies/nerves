import React from "react";
import { Star, Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import { addToCart } from "../../../redux/slice/cart";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    discountPercentage?: number; // Added this line
    rating: number;
    category: string;
    reviewCount: number;
    image: string;
    isNew?: boolean;
    sellerId: string;
    total?: number;
    slug?: string;
    description?: string; // Added for completeness
    brand?: string; // Added for completeness
    stock?: number; // Added for completeness
    images?: string[]; // Added for completeness
  };
}

const formatPrice = (price: number) => {
  const hasDecimals = price % 1 !== 0;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(price);
};

const ProductCardAlt: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Use provided discountPercentage or calculate it
  const discountPercentage =
    product.discountPercentage ||
    (product.discountPrice
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0);

  const productSlug =
    product.slug ||
    product.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  return (
    <Link
      to={`/shop/${productSlug}`}
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.isNew && <span className="new-badge">New</span>}
        {discountPercentage > 0 && (
          <span className="discount-badge">-{discountPercentage}%</span>
        )}
        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={
                    i < Math.floor(product.rating) ? "currentColor" : "none"
                  }
                />
              ))}
          </div>
          <span className="review-count">({product.reviewCount})</span>
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
            </>
          ) : (
            <span className="price">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCardAlt;
