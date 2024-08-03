import React from "react";
import PlayerComponent from "../player/Player";
import EnemyComponent from "../enemy/Enemy";
import "./fight.css";

const FightComponent = () => {
  return (
    <div className="fight-container">
      <h1>Fight Screen</h1>
      <div className="fight-screen">
        <div className="player-side">
          <h2>Player</h2>
          <PlayerComponent />
        </div>
        <div className="combat-section">
          <h2>Combat Log</h2>
          <div className="combat-log"></div>
        </div>
        <div className="enemy-side">
          <h2>Enemy</h2>
          <EnemyComponent />
        </div>
      </div>
    </div>
  );
};

export default FightComponent;
