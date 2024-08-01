import "./App.css";
import React from "react";
import PlayerComponent from "./components/player/Player";
import EnemyComponent from "./components/enemy/Enemy";

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
