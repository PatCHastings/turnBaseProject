import "./enemy.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEnemy } from "../store/Store";

const EnemyComponent = () => {
  const dispatch = useDispatch();
  const enemy = useSelector((state) => state.enemy);
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/external/monsters"
        );
        console.log("Monsters fetched:", response.data);
        if (response.data && response.data.results) {
          setMonsters(response.data.results);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching monsters:", error);
      }
    };

    fetchMonsters();
  }, []);

  const saveEnemy = async (newEnemy) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/enemies",
        newEnemy,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Enemy saved:", response.data);
      dispatch(setEnemy(response.data)); // Update the context state
    } catch (error) {
      console.error("Error saving enemy:", error);
    }
  };

  const createEnemy = async () => {
    if (!monsters || monsters.length === 0) {
      console.error("No monsters available or monsters is undefined");
      return;
    }

    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    try {
      const monsterUrl = `http://localhost:8080/api/external/monsters/${randomMonster.index}`;
      const response = await axios.get(monsterUrl);
      console.log("Monster details fetched:", response.data);
      const newEnemy = {
        enemyName: response.data.name,
        enemyHealth: response.data.hit_points,
        size: response.data.size,
        type: response.data.type,
        alignment: response.data.alignment,
        armorClass: Array.isArray(response.data.armor_class)
          ? response.data.armor_class
              .map((ac) => `${ac.type}: ${ac.value}`)
              .join(", ")
          : response.data.armor_class,
        speed: response.data.speed,
        strength: response.data.strength,
        dexterity: response.data.dexterity,
        constitution: response.data.constitution,
        intelligence: response.data.intelligence,
        wisdom: response.data.wisdom,
        charisma: response.data.charisma,
        proficiencies: response.data.proficiencies,
        senses: response.data.senses,
        languages: response.data.languages,
        challengeRating: response.data.challenge_rating,
        specialAbilities: response.data.special_abilities,
        actions: response.data.actions,
        legendaryActions: response.data.legendary_actions,
      };
      saveEnemy(newEnemy);
    } catch (error) {
      console.error("Error fetching monster details:", error);
    }
  };

  return (
    <div className="monster-container">
      <div className="generate-enemy">
        <button onClick={createEnemy}>Generate Enemy</button>
      </div>

      {enemy && (
        <div className="stat-block">
          <h3>Enemy Info</h3>
          {enemy.imageUrl && (
            <img
              src={enemy.imageUrl}
              alt={enemy.enemyName}
              className="monster-image"
            />
          )}
          <div className="monster-info">
            <p>
              <strong>Name:</strong> {enemy.enemyName}
            </p>
            <p>
              <strong>Health:</strong> {enemy.enemyHealth}
            </p>
            <p>
              <strong>Size:</strong> {enemy.size}
            </p>
            <p>
              <strong>Type:</strong> {enemy.type}
            </p>
            <p>
              <strong>Alignment:</strong> {enemy.alignment}
            </p>
            <p>
              <strong>Armor Class:</strong> {enemy.armorClass}
            </p>
          </div>
          <div className="monster-stats">
            <p>
              <strong>Strength:</strong> {enemy.strength}
            </p>
            <p>
              <strong>Dexterity:</strong> {enemy.dexterity}
            </p>
            <p>
              <strong>Constitution:</strong> {enemy.constitution}
            </p>
            <p>
              <strong>Intelligence:</strong> {enemy.intelligence}
            </p>
            <p>
              <strong>Wisdom:</strong> {enemy.wisdom}
            </p>
            <p>
              <strong>Charisma:</strong> {enemy.charisma}
            </p>
            <p>
              <strong>Challenge Rating:</strong> {enemy.challengeRating}
            </p>
          </div>
          <h4>Special Abilities</h4>
          <ul>
            {enemy.specialAbilities &&
              enemy.specialAbilities.map((ability, index) => (
                <li key={index}>
                  <strong>{ability.name}:</strong> {ability.desc}
                </li>
              ))}
          </ul>
          <h4>Actions</h4>
          <ul>
            {enemy.actions &&
              enemy.actions.map((action, index) => (
                <li key={index}>
                  <strong>{action.name}:</strong> {action.desc}
                </li>
              ))}
          </ul>
          <h4>Legendary Actions</h4>
          <ul>
            {enemy.legendaryActions &&
              enemy.legendaryActions.map((action, index) => (
                <li key={index}>
                  <strong>{action.name}:</strong> {action.desc}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnemyComponent;
