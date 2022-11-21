import { createSlice } from '@reduxjs/toolkit'

const initialState = { gallery:[] }

const EventGallery = createSlice({
  name: 'eventGallery',
  initialState,
  reducers: {
    populateGallery(state, action) {
      state.gallery = action.payload
    }
  },
})

export const { populateGallery } = EventGallery.actions
export default EventGallery.reducer
