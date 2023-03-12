import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCollection } from '../../firebase/services';

export const getUsers = createAsyncThunk('users/getUsers', async () => {
  return getCollection('users');
});

const initialState = {
  users: [],
  userLoading: 'idle',
  // currentRequestId: undefined,
  // error: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoadingProfile: (state, action) => {
      state.userLoading = action.payload;
    },
  },
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.userLoading = 'pending';
    },
    [getUsers.fulfilled]: (state, action) => {
      state.users = action.payload;
      state.userLoading = 'success';
    },
    [getUsers.rejected]: (state) => {
      state.userLoading = 'failed';
    },
  },
});

export const { setLoadingProfile } = usersSlice.actions;

export default usersSlice.reducer;
