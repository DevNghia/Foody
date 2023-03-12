import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isHiddenLogin: true,
  isLogged: false,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    toggleHiddenLogin: (state, action) => {
      state.isHiddenLogin = action.payload;
    },
    checkLogged: (state, action) => {
      state.isLogged = action.payload;
    },
  },
});

export const { toggleHiddenLogin, checkLogged } = loginSlice.actions;

export default loginSlice.reducer;
