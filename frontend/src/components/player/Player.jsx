import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGame } from "../gameContext/GameContext";
import "./player.css";

const PlayerComponent = () => {
  const { setPlayer } = useGame();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [playerData, setPlayerData] = useState({
    name: "",
    health: 100,
    characterClass: null,
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/classes/fetch"
        );
        console.log("Classes fetched:", response.data);
        if (response.data) {
          setClasses(response.data);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    const classIndex = e.target.value;

    if (classIndex) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classes/${classIndex}`
        );
        console.log("Class details fetched:", response.data);
        const newClass = {};
        setSelectedClass(response.data);
        setPlayerData((prevPlayer) => ({
          ...prevPlayer,
          characterClass: response.data,
          hit_die: response.data,
        }));
      } catch (error) {
        console.error("Error fetching class details:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData((prevPlayer) => ({ ...prevPlayer, [name]: value }));
  };

  const savePlayer = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/players",
        playerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Player saved:", response.data);
      setPlayer(response.data); // Update the context state
    } catch (error) {
      console.error("Error saving player:", error);
    }
  };

  return (
    <div className="player-container">
      <h2>Create Player</h2>
      <div className="player-form">
        <label>
          Player Name:
          <input
            type="text"
            name="name"
            value={playerData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Select Class:
          <select name="characterClass" onChange={handleClassChange}>
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls.index} value={cls.index}>
                {cls.name}
              </option>
            ))}
          </select>
        </label>
        <button onClick={savePlayer}>Save Player</button>
      </div>

      {selectedClass && (
        <div className="class-info">
          <h3>Class Info</h3>
          <p>Name: {selectedClass.name}</p>
          <p>Hit Die: {selectedClass.hit_die}</p>
          <h4>Proficiencies</h4>
          <ul>
            {selectedClass.proficiencies &&
              selectedClass.proficiencies.map((proficiency, index) => (
                <li key={index}>{proficiency.name}</li>
              ))}
          </ul>
          <h4>Saving Throws</h4>
          <ul>
            {selectedClass.saving_throws &&
              selectedClass.saving_throws.map((savingThrow, index) => (
                <li key={index}>{savingThrow.name}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="player-info">
        <h3>Player Info</h3>
        <p>Name: {playerData.name}</p>
        <p>Class: {selectedClass ? selectedClass.name : "N/A"}</p>
        <p>Health: {playerData.health}</p>
      </div>
    </div>
  );
};

export default PlayerComponent;
