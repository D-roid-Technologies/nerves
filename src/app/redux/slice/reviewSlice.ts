// redux/slice/reviewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  helpful?: number;
  verifiedPurchase?: boolean;
  // Add seller information to track who owns the product
  sellerId?: string;
}

interface ReviewState {
  reviews: Review[];
}

// Load reviews from localStorage
const loadReviewsFromStorage = (): Review[] => {
  try {
    const stored = localStorage.getItem("userReviews");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading reviews from storage:", error);
    return [];
  }
};

// Save reviews to localStorage
const saveReviewsToStorage = (reviews: Review[]) => {
  try {
    localStorage.setItem("userReviews", JSON.stringify(reviews));
  } catch (error) {
    console.error("Error saving reviews to storage:", error);
  }
};

const initialState: ReviewState = {
  reviews: loadReviewsFromStorage(),
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.push(action.payload);
      saveReviewsToStorage(state.reviews);
    },
    updateReview: (state, action: PayloadAction<Review>) => {
      const index = state.reviews.findIndex(
        (review) => review.id === action.payload.id
      );
      if (index !== -1) {
        state.reviews[index] = action.payload;
        saveReviewsToStorage(state.reviews);
      }
    },
    deleteReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter(
        (review) => review.id !== action.payload
      );
      saveReviewsToStorage(state.reviews);
    },
    markHelpful: (state, action: PayloadAction<string>) => {
      const review = state.reviews.find((r) => r.id === action.payload);
      if (review) {
        review.helpful = (review.helpful || 0) + 1;
        saveReviewsToStorage(state.reviews);
      }
    },
    clearAllReviews: (state) => {
      state.reviews = [];
      localStorage.removeItem("userReviews");
    },
  },
});

export const {
  addReview,
  updateReview,
  deleteReview,
  markHelpful,
  clearAllReviews,
} = reviewSlice.actions;

// Selectors
export const selectReviewsByProduct = (state: any, productId: string) =>
  state.reviews.reviews.filter(
    (review: Review) => review.productId === productId
  );

export const selectUserReviews = (state: any, userId: string) =>
  state.reviews.reviews.filter((review: Review) => review.userId === userId);

// NEW: Select reviews written BY the user (reviews they authored)
export const selectReviewsWrittenByUser = (state: any, userEmail: string) =>
  state.reviews.reviews.filter(
    (review: Review) => review.userEmail === userEmail
  );

// NEW: Select reviews received FOR user's products (reviews on their products)
export const selectReviewsOnUserProducts = (
  state: any,
  sellerEmail: string,
  userItems: any[]
) => {
  const userProductIds = userItems.map((item) => item.id.toString());
  return state.reviews.reviews.filter(
    (review: Review) =>
      userProductIds.includes(review.productId) &&
      review.userEmail !== sellerEmail
  );
};

// NEW: Select all reviews related to user (both written by them and received on their products)
export const selectAllUserRelatedReviews = (
  state: any,
  userEmail: string,
  userItems: any[]
) => {
  const reviewsWritten = selectReviewsWrittenByUser(state, userEmail);
  const reviewsReceived = selectReviewsOnUserProducts(
    state,
    userEmail,
    userItems
  );

  return {
    reviewsWritten,
    reviewsReceived,
    allReviews: [...reviewsWritten, ...reviewsReceived].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
  };
};

export const selectProductRatingStats = (state: any, productId: string) => {
  const productReviews = selectReviewsByProduct(state, productId);
  if (productReviews.length === 0) {
    return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
  }

  const total = productReviews.reduce(
    (sum: number, review: Review) => sum + review.rating,
    0
  );
  const average = total / productReviews.length;

  const distribution = [0, 0, 0, 0, 0];
  productReviews.forEach((review: Review) => {
    distribution[review.rating - 1]++;
  });

  return {
    average: Number(average.toFixed(1)),
    count: productReviews.length,
    distribution,
  };
};

export default reviewSlice.reducer;
