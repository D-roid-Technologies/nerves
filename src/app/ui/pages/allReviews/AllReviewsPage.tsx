import React, { useState, useEffect } from "react";
import { Star, MessageSquare, ArrowLeft, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  selectAllUserRelatedReviews,
  Review,
} from "../../../redux/slice/reviewSlice";
import styles from "./AllReviews.module.css";

type SortOption =
  | "newest"
  | "oldest"
  | "rating-high"
  | "rating-low"
  | "helpful";

type ReviewFilter = "all" | "written" | "received";

export default function AllReviewsPage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const userEmail = user.primaryInformation?.email || "";

  // Get all reviews related to the user
  const userRelatedReviews = useSelector((state: RootState) =>
    selectAllUserRelatedReviews(state, userEmail, [])
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");

  // Initialize reviews when component mounts
  useEffect(() => {
    setReviews(userRelatedReviews.allReviews);
  }, [userRelatedReviews.allReviews]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterAndSortReviews(term, filterRating, sortBy, reviewFilter);
  };

  const handleRatingFilter = (rating: number | null) => {
    setFilterRating(rating);
    filterAndSortReviews(searchTerm, rating, sortBy, reviewFilter);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    filterAndSortReviews(searchTerm, filterRating, option, reviewFilter);
  };

  const handleReviewFilter = (filter: ReviewFilter) => {
    setReviewFilter(filter);
    let filteredReviews: Review[] = [];

    switch (filter) {
      case "written":
        filteredReviews = userRelatedReviews.reviewsWritten;
        break;
      case "received":
        filteredReviews = userRelatedReviews.reviewsReceived;
        break;
      default:
        filteredReviews = userRelatedReviews.allReviews;
    }

    filterAndSortReviews(
      searchTerm,
      filterRating,
      sortBy,
      filter,
      filteredReviews
    );
  };

  const filterAndSortReviews = (
    term: string,
    rating: number | null,
    sort: SortOption,
    reviewType: ReviewFilter,
    baseReviews?: Review[]
  ) => {
    let filtered = baseReviews || userRelatedReviews.allReviews;

    // Apply review type filter
    switch (reviewType) {
      case "written":
        filtered = userRelatedReviews.reviewsWritten;
        break;
      case "received":
        filtered = userRelatedReviews.reviewsReceived;
        break;
      default:
        filtered = userRelatedReviews.allReviews;
    }

    // Filter by search term
    if (term) {
      filtered = filtered.filter(
        (review: Review) =>
          review.productName.toLowerCase().includes(term.toLowerCase()) ||
          review.comment.toLowerCase().includes(term.toLowerCase()) ||
          (review.title &&
            review.title.toLowerCase().includes(term.toLowerCase()))
      );
    }

    // Filter by rating
    if (rating !== null) {
      filtered = filtered.filter((review: Review) => review.rating === rating);
    }

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        case "helpful":
          return (b.helpful || 0) - (a.helpful || 0);
        default:
          return 0;
      }
    });

    setReviews(sorted);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return "0.0";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getReviewType = (review: Review): "written" | "received" => {
    return review.userEmail === userEmail ? "written" : "received";
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
              {reviews.reduce((sum, review) => sum + (review.helpful || 0), 0)}
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

      {/* Review Type Filters */}
      <div className={styles.reviewTypeFilters}>
        <button
          onClick={() => handleReviewFilter("all")}
          className={`${styles.reviewTypeBtn} ${
            reviewFilter === "all" ? styles.active : ""
          }`}
        >
          All Reviews ({userRelatedReviews.allReviews.length})
        </button>
        <button
          onClick={() => handleReviewFilter("written")}
          className={`${styles.reviewTypeBtn} ${
            reviewFilter === "written" ? styles.active : ""
          }`}
        >
          My Reviews ({userRelatedReviews.reviewsWritten.length})
        </button>
        <button
          onClick={() => handleReviewFilter("received")}
          className={`${styles.reviewTypeBtn} ${
            reviewFilter === "received" ? styles.active : ""
          }`}
        >
          Product Reviews ({userRelatedReviews.reviewsReceived.length})
        </button>
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
            {reviews.map((review: Review) => (
              <div
                key={review.id}
                className={`${styles.reviewCard} ${
                  getReviewType(review) === "written"
                    ? styles.reviewWritten
                    : styles.reviewReceived
                }`}
              >
                <div className={styles.reviewHeader}>
                  <div>
                    <h3 className={styles.reviewTitle}>{review.productName}</h3>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewDate}>
                        {formatDate(review.date)}
                      </span>
                      {review.verifiedPurchase && (
                        <span className={styles.verifiedBadge}>
                          ✓ Verified Purchase
                        </span>
                      )}
                      <span className={styles.reviewTypeIndicator}>
                        {getReviewType(review) === "written"
                          ? "You reviewed this"
                          : "Review on your product"}
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

                {review.title && (
                  <h4 className={styles.reviewSubtitle}>{review.title}</h4>
                )}

                <p className={styles.reviewComment}>{review.comment}</p>

                {getReviewType(review) === "received" && (
                  <div className={styles.reviewerInfo}>
                    By: {review.userName}
                  </div>
                )}

                <div className={styles.reviewFooter}>
                  <span className={styles.helpfulCount}>
                    {review.helpful || 0} people found this helpful
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare size={48} />
            <h3>No reviews found</h3>
            <p>
              {userRelatedReviews.allReviews.length === 0
                ? "You don't have any reviews yet."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
