import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCollection } from '../../firebase/services';

const initialState = {
  productReviewLoading: 'idle',
  productReviews: [],
};

export const getProductReviews = createAsyncThunk(
  'product-reviews/getProductReviews',
  async () => {
    return getCollection('productReviews');
  }
);

export const productReviewsSlice = createSlice({
  name: 'product-reviews',
  initialState,
  reducers: {
    setProductReviewLoading: (state, action) => {
      state.productReviewLoading = action.payload;
    },
    setRemoveProductReviewStatus: (state, action) => {
      const productReviewSelected = state.productReviews.find(
        (productReview) => productReview.id === action.payload.id
      );
      productReviewSelected.removed = action.payload.status;
    },
    deleteProductReviewById: (state, action) => {
      state.productReviews = state.productReviews.filter(
        (productReview) => productReview.id !== action.payload
      );
    },
  },
  extraReducers: {
    [getProductReviews.pending]: (state) => {
      state.productReviewLoading = 'pending';
    },
    [getProductReviews.fulfilled]: (state, action) => {
      state.productReviews = action.payload;
      state.productReviewLoading = 'success';
    },
    [getProductReviews.rejected]: (state) => {
      state.productReviewLoading = 'failed';
    },
  },
});

export const {
  setProductReviewLoading,
  setRemoveProductReviewStatus,
  deleteProductReviewById,
} = productReviewsSlice.actions;

export default productReviewsSlice.reducer;
