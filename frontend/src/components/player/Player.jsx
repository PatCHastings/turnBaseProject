import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPlayer } from "../store/Store.js";
import "./player.css";

const PlayerComponent = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(
    player.characterClass || null
  );
  const [playerData, setPlayerData] = useState(player);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/classes/fetch"
        );
        setClasses(response.data);
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
        setSelectedClass(response.data);
        setPlayerData((prevPlayer) => ({
          ...prevPlayer,
          characterClass: response.data,
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
      dispatch(setPlayer(response.data));
    } catch (error) {
      console.error("Error saving player:", error);
    }
  };

  return (
    <div className="player-container">
      <h2>Create Player</h2>
      <div className="player-form">
        <div>
          <label className="player-name">
            Player Name:
            <input
              type="text"
              name="name"
              value={playerData.name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label className="player-class">
            Select Class:
            <select
              name="characterClass"
              onChange={handleClassChange}
              value={
                playerData.characterClass ? playerData.characterClass.index : ""
              }
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.index} value={cls.index}>
                  {cls.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button onClick={savePlayer}>Save Player</button>
      </div>
      <div className="stat-block">
        <div className="player-info">
          <h3>Player Info</h3>
          <p>Name: {playerData.name}</p>
          <p>Class: {selectedClass ? selectedClass.name : "N/A"}</p>
          <p>Health: {playerData.health}</p>
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
      </div>
    </div>
  );
};

export default PlayerComponent;
