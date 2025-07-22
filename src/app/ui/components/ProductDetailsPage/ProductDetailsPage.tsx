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
}

const ProductDetailsPage = () => {
  const { category, productTitle } = useParams<{
    category: string;
    productTitle: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock product data with complete details
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Premium Leather Watch",
      slug: "premium-leather-watch",
      price: 249.99,
      discountPrice: 199.99,
      rating: 4.5,
      reviewCount: 128,
      image:
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1170&auto=format&fit=crop",
      category: "watches",
      isNew: true,
      isFeatured: true,
      description:
        "Premium quality leather watch with exceptional craftsmanship. Designed for comfort and style, this watch is perfect for everyday use.",
      details: [
        "Genuine leather strap",
        "Stainless steel case",
        "Water resistant up to 50m",
        "Japanese quartz movement",
        "2-year warranty",
      ],
    },
    {
      id: 2,
      name: "Classic White Sneakers",
      slug: "classic-white-sneakers",
      price: 129.99,
      discountPrice: 99.99,
      rating: 4.8,
      reviewCount: 305,
      image:
        "https://images.unsplash.com/photo-1606813902612-b4239e2f2ac9?q=80&w=1170&auto=format&fit=crop",
      category: "shoes",
      isNew: false,
      isFeatured: true,
      description:
        "Timeless white sneakers made from premium materials for all-day comfort and style.",
      details: [
        "100% organic cotton canvas",
        "Vulcanized rubber sole",
        "Reinforced toe cap",
        "Machine washable",
        "Available in sizes 5-13",
      ],
    },
    {
      id: 3,
      name: "Vintage Denim Jacket",
      slug: "vintage-denim-jacket",
      price: 89.99,
      discountPrice: 69.99,
      rating: 4.3,
      reviewCount: 210,
      image:
        "https://images.unsplash.com/photo-1593032465171-8e6f07efb25b?q=80&w=1170&auto=format&fit=crop",
      category: "clothing",
      isNew: true,
      isFeatured: false,
      description: "Classic vintage denim jacket with modern fit and comfort.",
      details: [
        "100% cotton denim",
        "Pre-washed for softness",
        "Multiple pockets",
        "Available in sizes S-XXL",
      ],
    },
    {
      id: 4,
      name: "Luxury Perfume",
      slug: "luxury-perfume",
      price: 149.99,
      discountPrice: 129.99,
      rating: 4.7,
      reviewCount: 98,
      image:
        "https://images.unsplash.com/photo-1618354691390-0185b280f519?q=80&w=1170&auto=format&fit=crop",
      category: "fragrance",
      isNew: true,
      isFeatured: true,
      description: "Elegant and long-lasting fragrance for special occasions.",
      details: [
        "100ml bottle",
        "Eau de parfum concentration",
        "Lasts 8+ hours",
        "Elegant packaging",
      ],
    },
    {
      id: 5,
      name: "Stylish Sunglasses",
      slug: "stylish-sunglasses",
      price: 59.99,
      discountPrice: 49.99,
      rating: 4.2,
      reviewCount: 76,
      image:
        "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1170&auto=format&fit=crop",
      category: "accessories",
      isNew: false,
      isFeatured: false,
      description: "UV-protected sunglasses with polarized lenses.",
      details: [
        "100% UV protection",
        "Polarized lenses",
        "Lightweight frame",
        "Includes protective case",
      ],
    },
    {
      id: 6,
      name: "Bluetooth Earbuds",
      slug: "bluetooth-earbuds",
      price: 89.99,
      discountPrice: 69.99,
      rating: 4.6,
      reviewCount: 320,
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1170&auto=format&fit=crop",
      category: "electronics",
      isNew: true,
      isFeatured: true,
      description:
        "Wireless earbuds with crystal clear sound and long battery life.",
      details: [
        "True wireless stereo",
        "24-hour battery life",
        "IPX5 water resistant",
        "Touch controls",
      ],
    },
    {
      id: 7,
      name: "Modern Office Chair",
      slug: "modern-office-chair",
      price: 299.99,
      discountPrice: 249.99,
      rating: 4.9,
      reviewCount: 145,
      image:
        "https://images.unsplash.com/photo-1598300053181-8466b437c0f1?q=80&w=1170&auto=format&fit=crop",
      category: "furniture",
      isNew: true,
      isFeatured: true,
      description:
        "Ergonomic office chair with lumbar support and adjustable height.",
      details: [
        "Breathable mesh back",
        "Adjustable armrests",
        "360-degree swivel",
        "Weight capacity: 300lbs",
      ],
    },
    {
      id: 8,
      name: "Leather Backpack",
      slug: "leather-backpack",
      price: 179.99,
      discountPrice: 149.99,
      rating: 4.4,
      reviewCount: 88,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1170&auto=format&fit=crop",
      category: "bags",
      isNew: false,
      isFeatured: false,
      description: "Genuine leather backpack with multiple compartments.",
      details: [
        "Full-grain leather",
        'Laptop compartment (fits 15" laptop)',
        "Water-resistant",
        "Adjustable shoulder straps",
      ],
    },
    {
      id: 9,
      name: "Smart Fitness Band",
      slug: "smart-fitness-band",
      price: 99.99,
      discountPrice: 79.99,
      rating: 4.5,
      reviewCount: 200,
      image:
        "https://images.unsplash.com/photo-1603791452906-c0e7c74be3c5?q=80&w=1170&auto=format&fit=crop",
      category: "wearables",
      isNew: true,
      isFeatured: true,
      description:
        "Track your fitness and health metrics with this smart band.",
      details: [
        "Heart rate monitoring",
        "Sleep tracking",
        "Water resistant (50m)",
        "14-day battery life",
      ],
    },
    {
      id: 10,
      name: "Cotton Crew T-Shirt",
      slug: "cotton-crew-t-shirt",
      price: 29.99,
      discountPrice: 19.99,
      rating: 4.1,
      reviewCount: 67,
      image:
        "https://images.unsplash.com/photo-1581574203976-1e6adf6f39c6?q=80&w=1170&auto=format&fit=crop",
      category: "clothing",
      isNew: true,
      isFeatured: false,
      description: "Soft and comfortable cotton t-shirt for everyday wear.",
      details: [
        "100% organic cotton",
        "Reinforced stitching",
        "Classic crew neck",
        "Available in sizes XS-XXL",
      ],
    },
    {
      id: 11,
      name: "Elegant Handbag",
      slug: "elegant-handbag",
      price: 199.99,
      discountPrice: 179.99,
      rating: 4.6,
      reviewCount: 110,
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1170&auto=format&fit=crop",
      category: "bags",
      isNew: false,
      isFeatured: true,
      description: "Sophisticated handbag with premium craftsmanship.",
      details: [
        "Genuine leather exterior",
        "Multiple interior pockets",
        "Detachable shoulder strap",
        "Gold-tone hardware",
      ],
    },
    {
      id: 12,
      name: "Wireless Charging Pad",
      slug: "wireless-charging-pad",
      price: 39.99,
      discountPrice: 29.99,
      rating: 4.3,
      reviewCount: 134,
      image:
        "https://images.unsplash.com/photo-1611801804439-01966f1ab4d3?q=80&w=1170&auto=format&fit=crop",
      category: "electronics",
      isNew: true,
      isFeatured: false,
      description: "Fast wireless charging for Qi-enabled devices.",
      details: [
        "10W fast charging",
        "LED charging indicator",
        "Non-slip surface",
        "Compact design",
      ],
    },
    {
      id: 13,
      name: "Gaming Headset",
      slug: "gaming-headset",
      price: 149.99,
      discountPrice: 129.99,
      rating: 4.8,
      reviewCount: 410,
      image:
        "https://images.unsplash.com/photo-1623268432217-76a05b6c58b1?q=80&w=1170&auto=format&fit=crop",
      category: "electronics",
      isNew: false,
      isFeatured: true,
      description: "Immersive gaming headset with crystal clear audio.",
      details: [
        "7.1 surround sound",
        "Noise-cancelling microphone",
        "Memory foam ear cushions",
        "RGB lighting",
      ],
    },
    {
      id: 14,
      name: "Elegant Table Lamp",
      slug: "elegant-table-lamp",
      price: 59.99,
      discountPrice: 45.99,
      rating: 4.4,
      reviewCount: 90,
      image:
        "https://images.unsplash.com/photo-1621428914527-cd3a85a4a9b2?q=80&w=1170&auto=format&fit=crop",
      category: "home",
      isNew: false,
      isFeatured: false,
      description: "Decorative table lamp with warm white light.",
      details: [
        "Ceramic base",
        "Fabric shade",
        "Dimmable",
        "Includes LED bulb",
      ],
    },
    {
      id: 15,
      name: "Casual Hoodie",
      slug: "casual-hoodie",
      price: 49.99,
      discountPrice: 39.99,
      rating: 4.5,
      reviewCount: 220,
      image:
        "https://images.unsplash.com/photo-1579613832124-6be203f4b68f?q=80&w=1170&auto=format&fit=crop",
      category: "clothing",
      isNew: true,
      isFeatured: true,
      description: "Comfortable and stylish hoodie for casual wear.",
      details: [
        "80% cotton, 20% polyester",
        "Kangaroo pocket",
        "Adjustable drawstring hood",
        "Available in sizes S-XXL",
      ],
    },
    {
      id: 16,
      name: "Stainless Steel Water Bottle",
      slug: "stainless-steel-water-bottle",
      price: 19.99,
      discountPrice: 14.99,
      rating: 4.7,
      reviewCount: 180,
      image:
        "https://images.unsplash.com/photo-1601918774946-25832aed10b?q=80&w=1170&auto=format&fit=crop",
      category: "fitness",
      isNew: true,
      isFeatured: false,
      description:
        "Keep your drinks hot or cold for hours with this insulated bottle.",
      details: [
        "Double-wall insulation",
        "Leak-proof lid",
        "BPA-free",
        "500ml capacity",
      ],
    },
    {
      id: 17,
      name: "Smartphone Gimbal",
      slug: "smartphone-gimbal",
      price: 109.99,
      discountPrice: 89.99,
      rating: 4.6,
      reviewCount: 95,
      image:
        "https://images.unsplash.com/photo-1611839270957-d6683bcbc8fd?q=80&w=1170&auto=format&fit=crop",
      category: "photography",
      isNew: false,
      isFeatured: true,
      description: "Professional stabilization for your smartphone videos.",
      details: [
        "3-axis stabilization",
        "Follow mode and lock mode",
        "Built-in tripod",
        "Works with most smartphones",
      ],
    },
    {
      id: 18,
      name: "Wireless Keyboard",
      slug: "wireless-keyboard",
      price: 69.99,
      discountPrice: 54.99,
      rating: 4.4,
      reviewCount: 140,
      image:
        "https://images.unsplash.com/photo-1587202372775-98973f4e4c9a?q=80&w=1170&auto=format&fit=crop",
      category: "electronics",
      isNew: true,
      isFeatured: true,
      description: "Slim wireless keyboard with quiet keys.",
      details: [
        "Bluetooth connectivity",
        "6-month battery life",
        "Low-profile keys",
        "Compact design",
      ],
    },
    {
      id: 19,
      name: "Minimalist Wall Clock",
      slug: "minimalist-wall-clock",
      price: 39.99,
      discountPrice: 29.99,
      rating: 4.2,
      reviewCount: 60,
      image:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1170&auto=format&fit=crop",
      category: "home",
      isNew: false,
      isFeatured: false,
      description: "Sleek and modern wall clock with silent movement.",
      details: [
        "30cm diameter",
        "Quartz movement",
        "Battery included",
        "Easy to hang",
      ],
    },
    {
      id: 20,
      name: "Linen Throw Blanket",
      slug: "linen-throw-blanket",
      price: 79.99,
      discountPrice: 59.99,
      rating: 4.5,
      reviewCount: 122,
      image:
        "https://images.unsplash.com/photo-1616595526840-6f1a4bc0db9c?q=80&w=1170&auto=format&fit=crop",
      category: "home",
      isNew: true,
      isFeatured: false,
      description: "Soft and breathable linen throw blanket for your home.",
      details: [
        "100% European flax linen",
        "Oeko-Tex certified",
        "150cm x 200cm",
        "Machine washable",
      ],
    },
  ];

  // Product images gallery
  const productImages = [
    product?.image || "",
    "https://via.placeholder.com/600x600?text=Product+2",
    "https://via.placeholder.com/600x600?text=Product+3",
    "https://via.placeholder.com/600x600?text=Product+4",
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Find product by matching both category and slug
        const foundProduct = mockProducts.find(
          (p) =>
            p.category.toLowerCase() === category?.toLowerCase() &&
            p.slug === productTitle
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate("/not-found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        navigate("/not-found");
      }
    };

    fetchProduct();
  }, [category, productTitle, navigate]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart(product, quantity) // Note: passing two arguments now
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
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
              <span className="meta-value in-stock">In Stock (20+ items)</span>
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

      {/* Related Products Section */}
      <section
        className="related-products"
        aria-labelledby="related-products-heading"
      >
        <h2 id="related-products-heading">You May Also Like</h2>
        <div className="related-products-grid">
          {mockProducts
            .filter(
              (p) => p.id !== product.id && p.category === product.category
            )
            .slice(0, 4)
            .map((relatedProduct) => (
              <article key={relatedProduct.id} className="related-product-card">
                <Link
                  to={`/products/${relatedProduct.category.toLowerCase()}/${relatedProduct.slug
                    }`}
                  className="related-product-link"
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    loading="lazy"
                  />
                  <h3>{relatedProduct.name}</h3>
                  <div className="price">
                    {relatedProduct.discountPrice ? (
                      <>
                        <span className="discounted-price">
                          {formatPrice(relatedProduct.discountPrice)}
                        </span>
                        <span className="original-price">
                          {formatPrice(relatedProduct.price)}
                        </span>
                      </>
                    ) : (
                      formatPrice(relatedProduct.price)
                    )}
                  </div>
                </Link>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
