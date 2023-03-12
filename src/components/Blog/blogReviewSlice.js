import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCollection } from '../../firebase/services';

const initialState = {
  blogReviewLoading: 'idle',
  blogReviews: [],
};

export const getBlogReviews = createAsyncThunk(
  'blog-reviews/getBlogReviews',
  async () => {
    return getCollection('blogReviews');
  }
);

export const blogReviewsSlice = createSlice({
  name: 'blog-reviews',
  initialState,
  reducers: {
    setBlogReviewLoading: (state, action) => {
      state.blogReviewLoading = action.payload;
    },
    setRemoveBlogReviewStatus: (state, action) => {
      const blogReviewSelected = state.blogReviews.find(
        (blogReview) => blogReview.id === action.payload.id
      );
      blogReviewSelected.removed = action.payload.status;
    },
    deleteBlogReviewById: (state, action) => {
      state.blogReviews = state.blogReviews.filter(
        (blogReview) => blogReview.id !== action.payload
      );
    },
  },
  extraReducers: {
    [getBlogReviews.pending]: (state) => {
      state.blogReviewLoading = 'pending';
    },
    [getBlogReviews.fulfilled]: (state, action) => {
      state.blogReviews = action.payload;
      state.blogReviewLoading = 'success';
    },
    [getBlogReviews.rejected]: (state) => {
      state.blogReviewLoading = 'failed';
    },
  },
});

export const {
  setBlogReviewLoading,
  setRemoveBlogReviewStatus,
  deleteBlogReviewById,
} = blogReviewsSlice.actions;

export default blogReviewsSlice.reducer;
