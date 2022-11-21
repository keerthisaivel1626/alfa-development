import { createSlice } from '@reduxjs/toolkit'

const initialState = { isAuth: false, loggedUserData:null }

const AuthReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeAuthStatus(state, action) {
      state.isAuth=action.payload
    },
    storeLoginResponse(state, action) {
      state.loggedUserData=action.payload
    },
  },
})

export const { changeAuthStatus, storeLoginResponse } = AuthReducer.actions
export default AuthReducer.reducer
