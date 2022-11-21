import { createSlice } from '@reduxjs/toolkit'

const initialState = { visible: false }

const SpinnerReducer = createSlice({
  name: 'spinner',
  initialState,
  reducers: {
    changeSpinnerStatus(state, action) {
      state.visible=action.payload
    }
  },
})

export const { changeSpinnerStatus } = SpinnerReducer.actions
export default SpinnerReducer.reducer
