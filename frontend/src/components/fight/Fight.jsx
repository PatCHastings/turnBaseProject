import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./fight.css";
import ScrollingLog from "../logs/ScrollingLog.jsx";
import TextDamageFX from "../textFXs/TextDamageFX.jsx";
import {
  setPlayer,
  updatePlayerHealth,
  updatePlayerExperience,
} from "../store/Store";
import { setEnemy, updateEnemyHealth } from "../store/Store";

const FightComponent = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const enemy = useSelector((state) => state.enemy);
  const selectedClass = useSelector((state) => state.class.selectedClass);
  const playerData = useSelector((state) => state.player);
  const [combatLog, setCombatLog] = useState([]);
  const [actionPending, setActionPending] = useState(false);
  const [combatStarted, setCombatStarted] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(null);

  const startCombat = async () => {
    console.log("Begin Fight clicked");
    setActionPending(true);
    console.log("Player ID:", player.id);
    console.log("Enemy ID:", enemy.id);
    try {
      const response = await axios.post(
        "http://localhost:8080/combat/start",
        null,
        {
          params: { playerId: player.id, enemyId: enemy.id },
        }
      );

      if (response && response.data) {
        console.log("Start combat response:", response.data);
        setCombatLog((prevLog) => [...prevLog, ...response.data.log]);
        setPlayerTurn(response.data.playerTurn);
        setCombatStarted(true);
        console.log(
          "Player Turn after start combat:",
          response.data.playerTurn
        );

        if (!response.data.playerTurn) {
          // Enemy's turn
          await performEnemyAction(); // Call the enemy action method here
        }
      } else {
        setCombatLog((prevLog) => [
          ...prevLog,
          { actionDescription: "Error: No response data from server." },
        ]);
      }
    } catch (error) {
      console.error("Error starting combat:", error);
      setCombatLog((prevLog) => [
        ...prevLog,
        { actionDescription: "Error starting combat: " + error.message },
      ]);
    }
    setActionPending(false);
  };

  const performEnemyAction = async () => {
    try {
      console.log("Enemy action triggered");
      const response = await performAction("enemyaction");
      if (response && response.data) {
        console.log("Enemy action response:", response.data);
        setCombatLog((prevLog) => [...prevLog, ...response.data.log]);

        // Update player experience
        if (response.data.playerExperience) {
          dispatch(updatePlayerExperience(response.data.playerExperience));
        }

        if (response.data.playerTurn) {
          // Now it's the player's turn
          setPlayerTurn(true);
          console.log("Now it's the player's turn.");
        } else {
          console.log("Enemy's turn again."); // Enemy's turn continues
        }
      }
    } catch (error) {
      console.error("Error performing enemy action:", error);
      setCombatLog((prevLog) => [
        ...prevLog,
        {
          actionDescription: "Error performing enemy action: " + error.message,
        },
      ]);
    }
  };

  const performAction = async (actionType) => {
    console.log(actionType + " clicked");
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

      if (response) {
        console.log("Response received:", response);
      } else {
        console.log("No response received from the server.");
      }

      if (response && response.data) {
        console.log("Perform action response:", response.data);
        const data = response.data;

        setCombatLog((prevLog) => [...prevLog, ...data.log]);

        dispatch(updatePlayerHealth(data.playerHealth));
        dispatch(updateEnemyHealth(data.enemyHealth));
        dispatch(updatePlayerExperience(response.data.playerExperience));
        // Debug logs to confirm updates
        console.log("Updated Player Health:", data.playerHealth);
        console.log("Updated Enemy Health:", data.enemyHealth);

        if (data.playerHealth <= 0) {
          setCombatLog((prevLog) => [
            ...prevLog,
            { actionDescription: "Player has been defeated!" },
          ]);
        } else if (data.enemyHealth <= 0) {
          setCombatLog((prevLog) => [
            ...prevLog,
            { actionDescription: "Enemy has been defeated!" },
          ]);
        } else {
          // Update the turn state after each action
          setPlayerTurn(data.playerTurn);
          console.log("Player Turn after action:", data.playerTurn);

          // If it's not the player's turn, trigger the enemy's action
          if (!response.data.playerTurn) {
            await performEnemyAction(); // Avoid directly calling performAction again
          }
        }
      } else {
        setCombatLog((prevLog) => [
          ...prevLog,
          { actionDescription: "Error: No response data from server." },
        ]);
      }
    } catch (error) {
      console.error("Error performing action:", error.message);
      setCombatLog((prevLog) => [
        ...prevLog,
        { actionDescription: "Error performing action: " + error.message },
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
          {/* Player damage popup */}
          <TextDamageFX combatLog={combatLog} characterId={player.id} />
          <img
            src={playerData.characterImage}
            className="barbarian-happy"
            alt="player"
          />
          {player ? (
            <div>
              <p>Name: {player.name}</p>
              <p>Health: {player.health}</p>
              <p>Experience: {player.experience}</p>
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
            {!combatStarted ? (
              <button onClick={startCombat} disabled={actionPending}>
                Begin Fight
              </button>
            ) : playerTurn ? (
              <button
                onClick={() => performAction("attack")}
                disabled={actionPending}
              >
                Attack
              </button>
            ) : (
              <button
                onClick={() => setPlayerTurn(!playerTurn)}
                disabled={actionPending}
              >
                End Turn
              </button>
            )}
          </div>
          <h2>Combat Log</h2>
          <div className="combat-log">
            <ScrollingLog entries={combatLog} />
          </div>
        </div>
        <div className="enemy-side">
          <TextDamageFX combatLog={combatLog} characterId={enemy.id} />
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
