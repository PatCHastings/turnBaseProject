import React from "react";
import PlayerComponent from "../player/Player";
import EnemyComponent from "../enemy/Enemy";
import "./fight.css";

const FightComponent = () => {
  return (
    <div>
      <h1>Fight Screen</h1>
      <div className="fight-screen">
        <div>
          <h2>Player</h2>
          <PlayerComponent />
        </div>
        <div>
          <h2>Enemy</h2>
          <EnemyComponent />
        </div>
      </div>
    </div>
  );
};

export default FightComponent;
