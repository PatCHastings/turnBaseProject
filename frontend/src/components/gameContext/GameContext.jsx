import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const GameContext = createContext();

// Provider component
export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(() => {
    const savedPlayer = localStorage.getItem("player");
    return savedPlayer ? JSON.parse(savedPlayer) : null;
  });

  const [enemy, setEnemy] = useState(() => {
    const savedEnemy = localStorage.getItem("enemy");
    return savedEnemy ? JSON.parse(savedEnemy) : null;
  });

  const [combatLog, setCombatLog] = useState([]);
  const [classes, setClasses] = useState([]);
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/classes/fetch"
        );
        console.log("Classes fetched:", response.data);
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

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

    fetchClasses();
    fetchMonsters();
  }, []);

  useEffect(() => {
    if (player) {
      localStorage.setItem("player", JSON.stringify(player));
    }
  }, [player]);

  useEffect(() => {
    if (enemy) {
      localStorage.setItem("enemy", JSON.stringify(enemy));
    }
  }, [enemy]);

  const value = {
    player,
    setPlayer,
    enemy,
    setEnemy,
    combatLog,
    setCombatLog,
    classes,
    monsters,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use the GameContext
export const useGame = () => {
  return useContext(GameContext);
};
