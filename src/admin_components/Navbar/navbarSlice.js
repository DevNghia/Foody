import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collapsed: false,
  selected: 'analytics',
};

export const navbarAdminSlice = createSlice({
  name: 'admin-navbar',
  initialState,
  reducers: {
    toggleCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { toggleCollapsed, setSelected } = navbarAdminSlice.actions;

export default navbarAdminSlice.reducer;
