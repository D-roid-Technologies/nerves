import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addReview } from "../../../redux/slice/reviewSlice";
import { RootState } from "../../../redux/store";
import toast, { Toaster } from "react-hot-toast";
import "./ReviewModal.css";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
  };
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a review comment");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use email as userId since userId doesn't exist in PrimaryInformation
      const userEmail =
        user.primaryInformation?.email || "anonymous@example.com";

      const newReview = {
        id: `review_${Date.now()}`,
        productId: product.id,
        productName: product.name,
        userId: userEmail, // Use email as userId
        userName:
          `${user.primaryInformation?.firstName} ${user.primaryInformation?.lastName}` ||
          "Anonymous",
        userEmail: userEmail,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        date: new Date().toISOString(),
        helpful: 0,
        verifiedPurchase: true,
      };

      dispatch(addReview(newReview));

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");

      onClose();

      // Show success message
      toast.success("Thank you for your review!", {
        style: { background: "#4BB543", color: "#fff" },
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay" onClick={handleOverlayClick}>
      <div className="review-modal">
        <div className="review-modal-header">
          <h2>Write a Review</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="review-product-info">
          <h3>{product.name}</h3>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-section">
            <label>Overall Rating *</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    size={32}
                    fill={star <= (hoverRating || rating) ? "#ffc107" : "none"}
                    color={star <= (hoverRating || rating) ? "#ffc107" : "#ddd"}
                  />
                </button>
              ))}
            </div>
            <div className="rating-text">
              {rating === 0 && "Click to rate"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review-title">Review Title (Optional)</label>
            <input
              type="text"
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="review-comment">Your Review *</label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product. What did you like or dislike?"
              rows={6}
              maxLength={1000}
              required
            />
            <div className="character-count">{comment.length}/1000</div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
