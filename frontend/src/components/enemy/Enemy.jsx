import "./enemy.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const EnemyComponent = () => {
  const [enemy, setEnemy] = useState(null);
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
      setEnemy({
        enemyName: response.data.name,
        enemyHealth: response.data.hit_points,
        //imageUrl: `https://www.dnd5eapi.co${response.data.image}`, // Ensure correct image URL
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
      });
    } catch (error) {
      console.error("Error fetching monster details:", error);
    }
  };

  return (
    <div className="">
      <h2>Generate Enemy</h2>
      <button onClick={createEnemy}>Generate Enemy</button>

      {enemy && (
        <div>
          <h3>Enemy Info</h3>
          {enemy.imageUrl && (
            <img
              src={enemy.imageUrl}
              alt={enemy.enemyName}
              style={{ width: "200px" }}
            />
          )}
          <div className="monsterInfo">
            <p>Name: {enemy.enemyName}</p>
            <p>Health: {enemy.enemyHealth}</p>
            <p>Size: {enemy.size}</p>
            <p>Type: {enemy.type}</p>
            <p>Alignment: {enemy.alignment}</p>
            <p>Armor Class: {enemy.armorClass}</p>
          </div>
          {/* <p>
            Speed:{" "}
            {Object.entries(enemy.speed)
              .map(([type, value]) => `${type}: ${value}`)
              .join(", ")}
          </p> */}
          <div className="">
            <p>Strength: {enemy.strength}</p>
            <p>Dexterity: {enemy.dexterity}</p>
            <p>Constitution: {enemy.constitution}</p>
            <p>Intelligence: {enemy.intelligence}</p>
            <p>Wisdom: {enemy.wisdom}</p>
            <p>Charisma: {enemy.charisma}</p>
            {/* <p>Languages: {enemy.languages}</p> */}
            <p>Challenge Rating: {enemy.challengeRating}</p>
          </div>
          <h4>Special Abilities</h4>
          <ul>
            {enemy.specialAbilities.map((ability, index) => (
              <li key={index}>
                <strong>{ability.name}:</strong> {ability.desc}
              </li>
            ))}
          </ul>
          <h4>Actions</h4>
          <ul>
            {enemy.actions.map((action, index) => (
              <li key={index}>
                <strong>{action.name}:</strong> {action.desc}
              </li>
            ))}
          </ul>
          <h4>Legendary Actions</h4>
          <ul>
            {enemy.legendaryActions.map((action, index) => (
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
