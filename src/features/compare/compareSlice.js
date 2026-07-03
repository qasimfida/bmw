import { createSlice } from '@reduxjs/toolkit';

const compareSlice = createSlice({
  name: 'compare',
  initialState: {
    compareList: [],
  },
  reducers: {
    addToCompare: (state, action) => {
      if (state.compareList.length < 2) {
        const exists = state.compareList.find((car) => car.id === action.payload.id);
        if (!exists) {
          state.compareList.push(action.payload);
        }
      }
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter(
        (car) => car.id !== action.payload
      );
    },
    clearCompare: (state) => {
      state.compareList = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } =
  compareSlice.actions;

export const selectCompareList = (state) => state.compare.compareList;
export const selectIsInCompare = (id) => (state) =>
  state.compare.compareList.some((car) => car.id === id);

export default compareSlice.reducer;
