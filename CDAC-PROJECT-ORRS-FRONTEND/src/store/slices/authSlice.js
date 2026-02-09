import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      // Store token in sessionStorage (clears on browser close)
      sessionStorage.setItem('token', action.payload.token)
      sessionStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    loginFailure: (state, action) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      // Clear sessionStorage
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
    // Initialize auth state from sessionStorage
    initializeAuth: (state) => {
      const token = sessionStorage.getItem('token')
      const user = sessionStorage.getItem('user')
      
      if (token && user) {
        state.token = token
        state.user = JSON.parse(user)
        state.isAuthenticated = true
      } else {
        state.token = null
        state.user = null
        state.isAuthenticated = false
      }
    },
    // Update user data (for profile updates)
    setUser: (state, action) => {
      state.user = action.payload
      // Update sessionStorage with new user data
      sessionStorage.setItem('user', JSON.stringify(action.payload))
    },
  },
})

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError, 
  initializeAuth,
  setUser
} = authSlice.actions

export default authSlice.reducer