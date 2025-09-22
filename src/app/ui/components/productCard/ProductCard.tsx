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
    rating: number;
    category: string;
    reviewCount: number;
    image: string;
    isNew?: boolean;

    // Added fields for cart functionality
    sellerId: string; // required when adding to cart
    total?: number; // derived field: price * quantity
    addedAt?: string; // timestamp when added to cart
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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <Link
      to={`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
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

export default ProductCard;
