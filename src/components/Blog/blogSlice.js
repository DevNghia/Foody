import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCollection } from '../../firebase/services';

const initialState = {
  blogLoading: 'idle',
  blogs: [],
};

export const getBlogs = createAsyncThunk('blogs/getBlogs', async () => {
  return getCollection('blogs');
});

export const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogLoading: (state, action) => {
      state.blogLoading = action.payload;
    },
    setRemoveBlogStatus: (state, action) => {
      const blogSelected = state.blogs.find(
        (blog) => blog.id === action.payload.id
      );
      blogSelected.removed = action.payload.status;
    },
    deleteBlogById: (state, action) => {
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
    },
  },
  extraReducers: {
    [getBlogs.pending]: (state) => {
      state.blogLoading = 'pending';
    },
    [getBlogs.fulfilled]: (state, action) => {
      state.blogLoading = 'success';
      state.blogs = action.payload;
    },
    [getBlogs.rejected]: (state) => {
      state.blogLoading = 'failed';
    },
  },
});

export const { setBlogLoading, setRemoveBlogStatus, deleteBlogById } =
  blogsSlice.actions;

export default blogsSlice.reducer;
