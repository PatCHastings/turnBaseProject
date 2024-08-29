import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./fight.css";
import ScrollingLog from "../logs/ScrollingLog.jsx";
import TextDamageFX from "../textFXs/TextDamageFX.jsx";
import { setPlayer, updatePlayerHealth } from "../store/Store"; // Import setPlayer and updatePlayerHealth actions
import { setEnemy, updateEnemyHealth } from "../store/Store"; // Import setEnemy and updateEnemyHealth actions

const FightComponent = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const enemy = useSelector((state) => state.enemy);
  const selectedClass = useSelector((state) => state.class.selectedClass);
  const playerData = useSelector((state) => state.player);
  const [combatLog, setCombatLog] = useState([]);
  const [actionPending, setActionPending] = useState(false);

  const startCombat = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/combat/start",
        null,
        {
          params: { playerId: player.id, enemyId: enemy.id },
        }
      );
      setCombatLog([...combatLog, ...response.data.log]);
    } catch (error) {
      console.error("Error starting combat:", error);
      setCombatLog([...combatLog, "Error starting combat: " + error.message]);
    }
  };

  const performAction = async (actionType) => {
    setActionPending(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/combat/action",
        null,
        {
          params: {
            playerId: player.id,
            enemyId: enemy.id,
            actionType: actionType,
          },
        }
      );

      const data = response.data;
      if (data.log && Array.isArray(data.log)) {
        setCombatLog((prevLog) => [...prevLog, ...data.log]);
      } else {
        setCombatLog((prevLog) => [
          ...prevLog,
          "Unexpected data format: " + response.data,
        ]);
      }

      // Update player and enemy health in the global state
      dispatch(updatePlayerHealth(data.playerHealth));
      dispatch(updateEnemyHealth(data.enemyHealth));

      if (data.playerHealth <= 0) {
        setCombatLog((prevLog) => [...prevLog, "Player has been defeated!"]);
      } else if (data.enemyHealth <= 0) {
        setCombatLog((prevLog) => [...prevLog, "Enemy has been defeated!"]);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      setCombatLog((prevLog) => [
        ...prevLog,
        "Error performing action: " + error.message,
      ]);
    } finally {
      setActionPending(false);
    }
  };

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
          <img
            src={playerData.characterImage}
            className="barbarian-happy"
            alt="player"
          />
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
                Strength: {player.strength}
                <span className="modifier"> +{player.strengthModifier}</span>
              </p>
              <p>
                Dexterity: {player.dexterity}
                <span className="modifier"> +{player.dexterityModifier}</span>
              </p>
              <p>
                Intelligence: {player.intelligence}
                <span className="modifier">
                  {" "}
                  +{player.intelligenceModifier}
                </span>
              </p>
              <p>
                Wisdom: {player.wisdom}
                <span className="modifier"> +{player.wisdomModifier}</span>
              </p>
              <p>
                Charisma: {player.charisma}
                <span className="modifier"> +{player.charismaModifier}</span>
              </p>
            </div>
          ) : (
            <p>No player selected.</p>
          )}
        </div>
        <div className="combat-section">
          <div className="combat-actions">
            <button
              onClick={() => performAction("attack")}
              disabled={actionPending}
            >
              Attack
            </button>
            {/* Add more buttons for different actions like Defend, Use Item, etc. */}
          </div>
          <h2>Combat Log</h2>
          <div className="combat-log">
            <ScrollingLog entries={combatLog} />
          </div>
        </div>
        <div className="enemy-side">
          <TextDamageFX combatLog={combatLog} />
          <img
            src="/assets/enemies/minotaur.png"
            alt="enemy"
            className="enemy"
          />
          {enemy ? (
            <div>
              <p>Name: {enemy.name}</p>
              <p>Health: {enemy.health}</p>
              <p>Type: {enemy.type}</p>
              <p>
                Constitution: {enemy.constitution}
                <span className="modifier"> +{enemy.constitutionModifier}</span>
              </p>
              <p>
                Strength: {enemy.strength}
                <span className="modifier"> +{enemy.strengthModifier}</span>
              </p>
              <p>
                Dexterity: {enemy.dexterity}
                <span className="modifier"> +{enemy.dexterityModifier}</span>
              </p>
              <p>
                Intelligence: {enemy.intelligence}
                <span className="modifier"> +{enemy.intelligenceModifier}</span>
              </p>
              <p>
                Wisdom: {enemy.wisdom}
                <span className="modifier"> +{enemy.wisdomModifier}</span>
              </p>
              <p>
                Charisma: {enemy.charisma}
                <span className="modifier"> +{enemy.charismaModifier}</span>
              </p>
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
