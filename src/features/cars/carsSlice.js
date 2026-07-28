import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch cars data
export const fetchCars = createAsyncThunk('cars/fetchCars', async () => {
  // Simulate network delay for realistic loading state
  await new Promise((resolve) => setTimeout(resolve, 800));
  const response = await fetch('/data/cars.json');
  if (!response.ok) {
    throw new Error('Failed to fetch cars');
  }
  const data = await response.json();
  return data;
});

const initialState = {
  list: [],
  filteredList: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentPage: 1,
  itemsPerPage: 6,
  searchTerm: '',
  filters: {
    series: '',
    bodyType: '',
    fuelType: '',
  },
  selectedColor: null,
  secondaryColor: '#ffffff',
  bgLightColor: 'transparent',
  rimColor: '#e0e0e0', // Default light silver rims
};

// Helper to apply filters and search
const applyFilters = (list, searchTerm, filters) => {
  let result = [...list];

  // Search by model name
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    result = result.filter(
      (car) =>
        car.model.toLowerCase().includes(term) ||
        car.series.toLowerCase().includes(term)
    );
  }

  // Filter by series
  if (filters.series) {
    result = result.filter((car) => car.series === filters.series);
  }

  // Filter by body type
  if (filters.bodyType) {
    result = result.filter((car) => car.bodyType === filters.bodyType);
  }

  // Filter by fuel type
  if (filters.fuelType) {
    result = result.filter((car) => car.fuelType === filters.fuelType);
  }

  return result;
};

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      state.filteredList = applyFilters(state.list, state.searchTerm, state.filters);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
      state.filteredList = applyFilters(state.list, state.searchTerm, state.filters);
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.filters = { series: '', bodyType: '', fuelType: '' };
      state.currentPage = 1;
      state.filteredList = [...state.list];
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
    },
    setSecondaryColor: (state, action) => {
      state.secondaryColor = action.payload;
    },
    setBgLightColor: (state, action) => {
      state.bgLightColor = action.payload;
    },
    setRimColor: (state, action) => {
      state.rimColor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.filteredList = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, setFilters, clearFilters, setPage, setSelectedColor, setSecondaryColor, setBgLightColor, setRimColor } =
  carsSlice.actions;

// Selectors
export const selectAllCars = (state) => state.cars.list;
export const selectFilteredCars = (state) => state.cars.filteredList;
export const selectCarsStatus = (state) => state.cars.status;
export const selectCarsError = (state) => state.cars.error;
export const selectCurrentPage = (state) => state.cars.currentPage;
export const selectItemsPerPage = (state) => state.cars.itemsPerPage;
export const selectSearchTerm = (state) => state.cars.searchTerm;
export const selectFilters = (state) => state.cars.filters;
export const selectSelectedColor = (state) => state.cars.selectedColor;
export const selectSecondaryColor = (state) => state.cars.secondaryColor;
export const selectBgLightColor = (state) => state.cars.bgLightColor;
export const selectRimColor = (state) => state.cars.rimColor;

export const selectPaginatedCars = (state) => {
  const { filteredList, currentPage, itemsPerPage } = state.cars;
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredList.slice(startIndex, startIndex + itemsPerPage);
};

export const selectTotalPages = (state) => {
  const { filteredList, itemsPerPage } = state.cars;
  return Math.ceil(filteredList.length / itemsPerPage);
};

export const selectCarById = (id) => (state) =>
  state.cars.list.find((car) => car.id === Number(id));

// Get unique values for filter dropdowns
export const selectUniqueSeries = (state) =>
  [...new Set(state.cars.list.map((car) => car.series))].sort();

export const selectUniqueBodyTypes = (state) =>
  [...new Set(state.cars.list.map((car) => car.bodyType))].sort();

export const selectUniqueFuelTypes = (state) =>
  [...new Set(state.cars.list.map((car) => car.fuelType))].sort();

export default carsSlice.reducer;
