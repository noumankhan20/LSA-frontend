import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
}

const getInitialState = (): AuthState => {
  try {
    const serializedUser = localStorage.getItem('auth_user');
    if (serializedUser) {
      const user = JSON.parse(serializedUser);
      return {
        isAuthenticated: true,
        user,
      };
    }
  } catch (e) {
    console.error("Error reading auth_user from localStorage:", e);
  }
  return {
    isAuthenticated: false,
    user: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any }>
    ) => {
      const { user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      try {
        localStorage.setItem('auth_user', JSON.stringify(user));
      } catch (e) {
        console.error("Error writing auth_user to localStorage:", e);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      try {
        localStorage.removeItem('auth_user');
      } catch (e) {
        console.error("Error removing auth_user from localStorage:", e);
      }
      // Clear token cookie (in case JavaScript can reach it or as fallback)
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
