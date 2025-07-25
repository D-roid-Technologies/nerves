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
  };
}

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
      to={`/products/${product.category.toLowerCase()}/${product.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
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
        {/* {isHovered && (
          <button className="quick-add-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        )} */}
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
                ${product.discountPrice.toFixed(2)}
              </span>
              <span className="original-price">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="price">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
