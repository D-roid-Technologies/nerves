import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AllReviews.module.css";

// Extended mock reviews data
const mockReviews = [
  {
    id: 1,
    item: "Wireless Headphones",
    rating: 4,
    comment:
      "Great sound quality! The battery life is impressive and they're very comfortable for long listening sessions.",
    date: "2 weeks ago",
    dateSort: new Date("2024-08-20"),
    category: "Electronics",
    helpful: 12,
  },
  {
    id: 2,
    item: "Bluetooth Speaker",
    rating: 5,
    comment: "Excellent bass and clarity. Perfect for outdoor gatherings.",
    date: "1 month ago",
    dateSort: new Date("2024-08-04"),
    category: "Electronics",
    helpful: 8,
  },
  {
    id: 3,
    item: "Running Shoes",
    rating: 3,
    comment:
      "Decent comfort but sizing runs small. Quality is good for the price.",
    date: "2 months ago",
    dateSort: new Date("2024-07-04"),
    category: "Sports",
    helpful: 5,
  },
  {
    id: 4,
    item: "Coffee Maker",
    rating: 5,
    comment:
      "Makes perfect coffee every time. Easy to clean and looks great on the counter.",
    date: "3 months ago",
    dateSort: new Date("2024-06-04"),
    category: "Home",
    helpful: 15,
  },
  {
    id: 5,
    item: "Gaming Mouse",
    rating: 4,
    comment:
      "Responsive and comfortable for long gaming sessions. RGB lighting is a nice touch.",
    date: "3 months ago",
    dateSort: new Date("2024-06-01"),
    category: "Electronics",
    helpful: 7,
  },
  {
    id: 6,
    item: "Yoga Mat",
    rating: 2,
    comment:
      "Too thin and slippery. Doesn't provide enough cushioning for my knees.",
    date: "4 months ago",
    dateSort: new Date("2024-05-04"),
    category: "Sports",
    helpful: 3,
  },
];

type SortOption =
  | "newest"
  | "oldest"
  | "rating-high"
  | "rating-low"
  | "helpful";

export default function AllReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterAndSortReviews(term, filterRating, sortBy);
  };

  const handleRatingFilter = (rating: number | null) => {
    setFilterRating(rating);
    filterAndSortReviews(searchTerm, rating, sortBy);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    filterAndSortReviews(searchTerm, filterRating, option);
  };

  const filterAndSortReviews = (
    term: string,
    rating: number | null,
    sort: SortOption
  ) => {
    let filtered = mockReviews;

    // Filter by search term
    if (term) {
      filtered = filtered.filter(
        (review) =>
          review.item.toLowerCase().includes(term.toLowerCase()) ||
          review.comment.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by rating
    if (rating !== null) {
      filtered = filtered.filter((review) => review.rating === rating);
    }

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.dateSort.getTime() - a.dateSort.getTime();
        case "oldest":
          return a.dateSort.getTime() - b.dateSort.getTime();
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        case "helpful":
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    setReviews(sorted);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    ).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button
            onClick={() => navigate("/account")}
            className={styles.backButton}
          >
            <ArrowLeft size={20} />
          </button>
          <div className={styles.headerInfo}>
           
            <div>
              <h1 className={styles.title}>My Reviews</h1>
              <p className={styles.subtitle}>
                {reviews.length} review{reviews.length !== 1 ? "s" : ""} •{" "}
                {getAverageRating()} average rating
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{reviews.length}</div>
            <div className={styles.statLabel}>Total Reviews</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{getAverageRating()}</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {reviews.reduce((sum, review) => sum + review.helpful, 0)}
            </div>
            <div className={styles.statLabel}>Helpful Votes</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className={styles.ratingDistribution}>
          <h3>Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className={styles.ratingRow}>
              <span className={styles.ratingLabel}>{rating} stars</span>
              <div className={styles.ratingBar}>
                <div
                  className={styles.ratingFill}
                  style={{
                    width: `${
                      reviews.length > 0
                        ? (ratingDistribution[rating - 1] / reviews.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className={styles.ratingCount}>
                {ratingDistribution[rating - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={16} />
            <span>Filter by rating:</span>
            <div className={styles.ratingFilters}>
              <button
                onClick={() => handleRatingFilter(null)}
                className={`${styles.filterBtn} ${
                  filterRating === null ? styles.active : ""
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={`${styles.filterBtn} ${
                    filterRating === rating ? styles.active : ""
                  }`}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sortGroup}>
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              className={styles.sortSelect}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className={styles.reviewsSection}>
        {reviews.length > 0 ? (
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div>
                    <h3 className={styles.reviewTitle}>{review.item}</h3>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewDate}>{review.date}</span>
                      <span className={styles.reviewCategory}>
                        {review.category}
                      </span>
                    </div>
                  </div>
                  <div className={styles.reviewRating}>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={styles.star}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className={styles.ratingText}>{review.rating}/5</span>
                  </div>
                </div>

                <p className={styles.reviewComment}>{review.comment}</p>

                <div className={styles.reviewFooter}>
                  <span className={styles.helpfulCount}>
                    {review.helpful} people found this helpful
                  </span>
                  {/* <div className={styles.reviewActions}>
                    <button className={styles.actionBtn}>Edit</button>
                    <button className={styles.actionBtn}>Delete</button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare size={48} />
            <h3>No reviews found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
