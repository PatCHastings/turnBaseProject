// src/components/Enemy.jsx
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
      // Correct the URL by appending the index instead of the full URL path
      const monsterUrl = `http://localhost:8080/api/external/monsters/${randomMonster.index}`;
      const response = await axios.get(monsterUrl);
      setEnemy({
        enemyName: response.data.name,
        enemyHealth: response.data.hit_points, // Use the monster's hit points
        ...response.data, // Spread the rest of the monster data if needed
      });
    } catch (error) {
      console.error("Error fetching monster details:", error);
    }
  };

  return (
    <div>
      <h2>Generate Enemy</h2>
      <button onClick={createEnemy}>Generate Enemy</button>

      {enemy && (
        <div>
          <h3>Enemy Info</h3>
          <p>Enemy Name: {enemy.enemyName}</p>
          <p>Enemy Health: {enemy.enemyHealth}</p>
          {/* Display additional enemy details as needed */}
          <pre>{JSON.stringify(enemy, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default EnemyComponent;
