// src/App.jsx
import React from "react";
import PlayerComponent from "./components/Player";
import EnemyComponent from "./components/Enemy";

const App = () => {
  return (
    <div>
      <h1>Turn-Based RPG Game</h1>
      <PlayerComponent />
      <EnemyComponent />
    </div>
  );
};

export default App;
