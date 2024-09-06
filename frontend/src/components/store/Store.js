import { configureStore, createSlice } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import axios from 'axios';

// Initial state
const initialPlayerState = {
  name: '',
  health: null,
  experience: 0, 
  level: 0,
  characterClass: null,
};

const initialEnemyState = {
  name: '',
  health: null,
};

const initialClassState = {
  classes: [],
  selectedClass: null,
};

// Player slice
const playerSlice = createSlice({
  name: 'player',
  initialState: initialPlayerState,
  reducers: {
    setPlayer(state, action) {
      return { ...state, ...action.payload };
    },
    updatePlayerHealth(state, action) {
      console.log("Updating Player Health:", action.payload);
      state.health = action.payload;
    },
    updatePlayerExperience(state, action) {
      console.log("Updating Player Experience:", action.payload);
      state.experience = action.payload; 
    },
    updatePlayerLevel(state, action) {
      console.log("Updating Player Level:", action.payload);
      state.level = action.payload;
    },
  },
});

// Enemy slice
const enemySlice = createSlice({
  name: 'enemy',
  initialState: initialEnemyState,
  reducers: {
    setEnemy(state, action) {
      return { ...state, ...action.payload };
    },
    updateEnemyHealth(state, action) {
      console.log("Updating Enemy Health:", action.payload);
      state.health = action.payload;
    },
  },
});

// Class slice
const classSlice = createSlice({
  name: 'class',
  initialState: initialClassState,
  reducers: {
    setClasses(state, action) {
      state.classes = action.payload;
    },
    setSelectedClass(state, action) {
      state.selectedClass = action.payload;
    },
  },
});

// Export actions
export const { setPlayer, updatePlayerHealth, updatePlayerExperience, updatePlayerLevel } = playerSlice.actions;
export const { setEnemy, updateEnemyHealth } = enemySlice.actions;
export const { setClasses, setSelectedClass } = classSlice.actions;

// Thunk actions
export const fetchClasses = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8080/api/classes/fetch');
    dispatch(setClasses(response.data));
  } catch (error) {
    console.error('Error fetching classes:', error);
  }
};

export const fetchClassDetails = (classIndex) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/classes/${classIndex}`);
    console.log('Class Details Response:', response.data);
    dispatch(setSelectedClass(response.data));
  } catch (error) {
    console.error('Error fetching class details:', error);
  }
};

// Configure store
const store = configureStore({
  reducer: {
    player: playerSlice.reducer,
    enemy: enemySlice.reducer,
    class: classSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
