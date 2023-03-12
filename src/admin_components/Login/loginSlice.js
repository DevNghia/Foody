import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogged: false,
};

export const adminLoginSlice = createSlice({
  name: 'admin-login',
  initialState,
  reducers: {
    setLogged: (state, action) => {
      state.isLogged = action.payload;
    },
  },
});

export const { setLogged } = adminLoginSlice.actions;

export default adminLoginSlice.reducer;
