import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../reducers/AuthReducer';
import EventGallery from '../reducers/EventGallery';
import SpinnerReducer from '../reducers/SpinnerReducer';

const reducer = {
    authreducer: AuthReducer,
    spinnerReducer: SpinnerReducer,
    eventGalleryReducer: EventGallery,
}

export const store = configureStore({ reducer })