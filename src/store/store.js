import { configureStore } from '@reduxjs/toolkit';
import carsReducer from '../features/cars/carsSlice';
import compareReducer from '../features/compare/compareSlice';

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    compare: compareReducer,
  },
});

export default store;
