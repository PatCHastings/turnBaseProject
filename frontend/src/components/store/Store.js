import { createStore, combineReducers } from 'redux';

// Initial state
const initialPlayerState = {
  name: '',
  health: 100,
  characterClass: null,
};

const initialEnemyState = {
  name: '',
  health: null,
  characterClass: null,
};

// Action Types
const SET_PLAYER = 'SET_PLAYER';
const SET_ENEMY = 'SET_ENEMY';

// Action Creators
export const setPlayer = (player) => ({
  type: SET_PLAYER,
  payload: player,
});

export const setEnemy = (enemy) => ({
  type: SET_ENEMY,
  payload: enemy,
});

// Reducers
const playerReducer = (state = initialPlayerState, action) => {
  switch (action.type) {
    case SET_PLAYER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const enemyReducer = (state = initialEnemyState, action) => {
  switch (action.type) {
    case SET_ENEMY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  player: playerReducer,
  enemy: enemyReducer,
});

const store = createStore(rootReducer);

export default store;
