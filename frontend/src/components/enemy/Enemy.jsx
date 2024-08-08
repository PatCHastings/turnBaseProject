import "./enemy.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEnemy } from "../store/Store";

const EnemyComponent = () => {
  const dispatch = useDispatch();
  const enemy = useSelector((state) => state.enemy);
  const [monsters, setMonsters] = useState([]);

  const fetchMonsters = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/external/monsters"
      );
      console.log("Monsters fetched:", response.data);
      if (Array.isArray(response.data)) {
        setMonsters(response.data);
      } else {
        console.error("Unexpected response structure:", response.data);
        setError("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching monsters:", error);
      setError("Error fetching monsters");
    }
  };

  useEffect(() => {
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

      let speed;
      if (typeof response.data.speed === "object") {
        speed = Object.entries(response.data.speed)
          .map(([type, value]) => `${type}: ${value}`)
          .join(", ");
      } else {
        speed = response.data.speed;
      }

      const newEnemy = {
        enemyName: response.data.name,
        enemyHealth: response.data.hit_points,
        enemyType: response.data.type,
        size: response.data.size,
        alignment: response.data.alignment,
        armorClass: response.data.armor_class,
        speed: speed,
        strength: response.data.strength,
        dexterity: response.data.dexterity,
        constitution: response.data.constitution,
        intelligence: response.data.intelligence,
        wisdom: response.data.wisdom,
        charisma: response.data.charisma,
        challengeRating: response.data.challenge_rating,
        specialAbilities: response.data.special_abilities,
        actions: response.data.actions,
      };
      console.log("New enemy payload:", newEnemy); // Log the payload
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
              <strong>Speed:</strong> {enemy.speed}
            </p>
            <p>
              <strong>Type:</strong> {enemy.enemyType}
            </p>
            <p>
              <strong>Alignment:</strong> {enemy.alignment}
            </p>
            <p>
              <strong>Armor Class:</strong>
              {enemy.armorClass &&
                enemy.armorClass.map((ac, index) => (
                  <ul key={index}>
                    {ac.type}: {ac.value}
                  </ul>
                ))}
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
                  {action.damage && (
                    <ul>
                      {action.damage.map((dmg, dmgIndex) => (
                        <li key={dmgIndex}>
                          <strong>{dmg.damageType}:</strong> {dmg.damageDice}
                        </li>
                      ))}
                    </ul>
                  )}
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
