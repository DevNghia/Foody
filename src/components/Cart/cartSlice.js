import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCollection } from '../../firebase/services';

const getCartsLocalStorage = () => {
  const carts = JSON.parse(localStorage.getItem('carts'));
  if (carts?.length > 0) {
    return carts;
  }
  return [];
};

const initialState = {
  cartLoading: 'idle',
  carts: [],
  cartsLocalStorage: getCartsLocalStorage(),
};

export const getCarts = createAsyncThunk('carts/getCarts', async () => {
  return getCollection('carts');
});

export const cartsSlice = createSlice({
  name: 'carts',
  initialState,
  reducers: {
    setCartLoading: (state, action) => {
      state.cartLoading = action.payload;
    },
    addOrder: (state, action) => {
      state.cartsLocalStorage = action.payload;
    },
  },
  extraReducers: {
    [getCarts.pending]: (state) => {
      state.cartLoading = 'pending';
    },
    [getCarts.fulfilled]: (state, action) => {
      state.carts = action.payload;
      state.cartLoading = 'success';
    },
    [getCarts.rejected]: (state) => {
      state.cartLoading = 'failed';
    },
  },
});

export const { setCartLoading, addOrder } = cartsSlice.actions;

export default cartsSlice.reducer;
