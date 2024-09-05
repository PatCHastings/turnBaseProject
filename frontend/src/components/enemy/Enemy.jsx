import "./enemy.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEnemy } from "../store/Store";
import ParchmentBox from "../parchmentBox/ParchmentBox";

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

    fetchMonsters();
  }, []);

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
        name: response.data.name,
        health: response.data.hit_points,
        enemyType: response.data.type,
        size: response.data.size,
        alignment: response.data.alignment,
        armorClass: response.data.armor_class.map((ac) => ({
          type: ac.type,
          armorValue: ac.value,
        })),
        speed: speed,
        type: response.data.type,
        strength: response.data.strength,
        dexterity: response.data.dexterity,
        constitution: response.data.constitution,
        intelligence: response.data.intelligence,
        wisdom: response.data.wisdom,
        charisma: response.data.charisma,
        challengeRating: response.data.challenge_rating,
        specialAbilities: response.data.special_abilities,
        actions: response.data.actions.map((action) => ({
          name: action.name,
          desc: action.desc,
          attackBonus: action.attack_bonus || null,
          count: action.count || null,
          damage: action.damage
            ? action.damage.map((d) => ({
                damageDice: d.damage_dice,
                damageType: d.damage_type ? d.damage_type.name : null,
              }))
            : [],
        })),
      };
      console.log("New enemy payload:", newEnemy); // Log the payload
      const savedEnemy = await saveEnemy(newEnemy);
      const enemyId = savedEnemy.id;
      saveEnemyAbilityScores(enemyId, savedEnemy);
    } catch (error) {
      console.error("Error fetching monster details:", error);
    }
  };

  // Function to create an enemy from a monster with a challenge rating of 0
  const createEnemyWithChallengeRatingZero = async () => {
    try {
      // Step 1: Fetch monsters with challengeRating = 0 from your backend
      const response = await axios.get(
        "http://localhost:8080/api/external/monsters/challenge-rating/0"
      );
      const monsters = response.data;

      // Step 2: Randomly pick one of the monsters from the filtered list
      if (monsters && monsters.length > 0) {
        const randomMonster =
          monsters[Math.floor(Math.random() * monsters.length)];
        console.log("Selected Monster:", randomMonster);

        // Step 3: Use the selected monster's index to fetch full details from the external D&D API
        const monsterUrl = `https://www.dnd5eapi.co/api/monsters/${randomMonster.index}`;
        const monsterDetailsResponse = await axios.get(monsterUrl);
        const fullMonsterData = monsterDetailsResponse.data;

        // Step 4: Create the new enemy using the full details from the API
        let speed;
        if (typeof fullMonsterData.speed === "object") {
          speed = Object.entries(fullMonsterData.speed)
            .map(([type, value]) => `${type}: ${value}`)
            .join(", ");
        } else {
          speed = fullMonsterData.speed;
        }

        const newEnemy = {
          name: fullMonsterData.name,
          health: fullMonsterData.hit_points,
          enemyType: fullMonsterData.type,
          size: fullMonsterData.size,
          alignment: fullMonsterData.alignment,
          armorClass: fullMonsterData.armor_class.map((ac) => ({
            type: ac.type,
            armorValue: ac.value,
          })),
          speed: speed,
          strength: fullMonsterData.strength,
          dexterity: fullMonsterData.dexterity,
          constitution: fullMonsterData.constitution,
          intelligence: fullMonsterData.intelligence,
          wisdom: fullMonsterData.wisdom,
          charisma: fullMonsterData.charisma,
          challengeRating: fullMonsterData.challenge_rating,
          specialAbilities: fullMonsterData.special_abilities,
          actions: fullMonsterData.actions.map((action) => ({
            name: action.name,
            desc: action.desc,
            attackBonus: action.attack_bonus || null,
            count: action.count || null,
            damage: action.damage
              ? action.damage.map((d) => ({
                  damageDice: d.damage_dice,
                  damageType: d.damage_type ? d.damage_type.name : null,
                }))
              : [],
          })),
        };

        // Step 5: Save the new enemy as you've done before
        const savedEnemy = await saveEnemy(newEnemy);
        const enemyId = savedEnemy.id;
        saveEnemyAbilityScores(enemyId, savedEnemy);
      } else {
        console.error("No monsters found with challenge rating 0");
      }
    } catch (error) {
      console.error("Error creating enemy:", error);
    }
  };

  const updateAbilityScores = async (enemyId, abilityScores) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/enemies/${enemyId}/update-scores`,
        abilityScores,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Enemy updated with new ability scores:", response.data);
      dispatch(setEnemy(response.data));
    } catch (error) {
      console.error("Error updating ability scores:", error);
    }
  };

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
      dispatch(setEnemy(response.data));
      return response.data;
    } catch (error) {
      console.error("Error saving enemy:", error);
      throw error;
    }
  };

  const saveEnemyAbilityScores = (enemyId, savedEnemy) => {
    const abilityScores = {
      strength: savedEnemy.strength,
      dexterity: savedEnemy.dexterity,
      constitution: savedEnemy.constitution,
      intelligence: savedEnemy.intelligence,
      wisdom: savedEnemy.wisdom,
      charisma: savedEnemy.charisma,
    };

    updateAbilityScores(enemyId, abilityScores);
  };

  return (
    <div className="monster-container">
      <div className="generate-enemy">
        <button onClick={createEnemy}>Generate Enemy</button>
        <button onClick={createEnemyWithChallengeRatingZero}>
          Generate Enemy with Challenge Rating 0
        </button>
      </div>

      {enemy && (
        <div className="">
          <ParchmentBox>
            <h3>Enemy Info</h3>
            {enemy.imageUrl && (
              <img
                src={enemy.imageUrl}
                alt={enemy.name}
                className="monster-image"
              />
            )}
            <div className="monster-info">
              <p>
                <strong>Name:</strong> {enemy.name}
              </p>
              <p>
                <strong>Health:</strong> {enemy.health}
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
              <strong>Armor Class:</strong>
              {enemy.armorClass &&
                enemy.armorClass.map((ac, index) => (
                  <p key={index}>
                    {ac.type}: {ac.armorValue}
                  </p>
                ))}
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
                    {action.attackBonus !== null && (
                      <p>
                        <strong>Attack Bonus:</strong> {action.attackBonus}
                      </p>
                    )}
                    {action.count !== null && (
                      <p>
                        <strong>Count:</strong> {action.count}
                      </p>
                    )}
                    {action.damage && (
                      <ul>
                        {action.damage.map((damage, damageIndex) => (
                          <li key={damageIndex}>
                            <strong>{damage.damageType}:</strong>{" "}
                            {damage.damageDice}
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
          </ParchmentBox>
        </div>
      )}
    </div>
  );
};

export default EnemyComponent;
