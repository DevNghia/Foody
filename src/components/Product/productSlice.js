import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCollection } from '../../firebase/services';
// import { products } from '../../data';

const initialState = {
  productLoading: 'idle',
  products: [],
};

export const getProducts = createAsyncThunk(
  'products/getProducts',
  async () => {
    return getCollection('products');
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
    setRemoveStatus: (state, action) => {
      const productSelected = state.products.find(
        (product) => product.id === action.payload.id
      );
      productSelected.removed = action.payload.status;
    },
    deleteProductById: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
  },
  extraReducers: {
    [getProducts.pending]: (state) => {
      state.productLoading = 'pending';
    },
    [getProducts.fulfilled]: (state, action) => {
      state.products = action.payload;
      state.productLoading = 'success';
    },
    [getProducts.rejected]: (state) => {
      state.productLoading = 'failed';
    },
  },
});

export const { setProductLoading, setRemoveStatus, deleteProductById } =
  productsSlice.actions;

export default productsSlice.reducer;
