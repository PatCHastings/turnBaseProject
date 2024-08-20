import React from "react";
import { useSelector } from "react-redux";
import "./fight.css";
import "/assets/uiBackgrounds/player-menu.png";

const FightComponent = () => {
  const player = useSelector((state) => state.player);
  const enemy = useSelector((state) => state.enemy);
  const selectedClass = useSelector((state) => state.class.selectedClass);

  return (
    <div className="fight-container">
      <img
        src="../../../backgrounds/underground-arena.png"
        alt="arena"
        className="arena"
      />
      <h1>Fight Screen</h1>
      <div className="fight-screen">
        <div className="player-side">
          <h3>Player</h3>
          {player ? (
            <div>
              <p>Name: {player.name}</p>
              <p>Health: {player.health}</p>
              <p>Class: {selectedClass ? selectedClass.name : "N/A"}</p>
              <p>
                Constitution: {player.constitution}
                <span className="modifier">
                  {" "}
                  +{player.constitutionModifier}
                </span>
              </p>
              <p>
                Strength: {player.strength} +{""}
                {player.strengthModifier}
              </p>
            </div>
          ) : (
            <p>No player selected.</p>
          )}
        </div>
        <div className="combat-section">
          <h2>Combat Log</h2>
          <div className="combat-log"></div>
        </div>
        <div className="enemy-side">
          <h3>Enemy</h3>
          {enemy ? (
            <div>
              <p>Name: {enemy.enemyName}</p>
              <p>Health: {enemy.enemyHealth}</p>
              <p>Type: {enemy.type}</p>
            </div>
          ) : (
            <p>No enemy generated.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FightComponent;
