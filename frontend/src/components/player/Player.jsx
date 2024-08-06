import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPlayer, fetchClasses, fetchClassDetails } from "../store/Store";
import "./player.css";

const PlayerComponent = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const classes = useSelector((state) => state.class.classes);
  const selectedClass = useSelector((state) => state.class.selectedClass);
  const [playerData, setPlayerData] = useState(player);

  useEffect(() => {
    if (classes.length === 0) {
      dispatch(fetchClasses());
    }
  }, [dispatch, classes.length]);

  useEffect(() => {
    // Resets playerData if changing routes to avoid overwriting the player state
    setPlayerData({
      name: "",
      health: null,
      characterClass: null,
    });
  }, []);

  const handleClassChange = (e) => {
    const classIndex = e.target.value;

    if (classIndex) {
      dispatch(fetchClassDetails(classIndex));
      setPlayerData((prevPlayer) => ({
        ...prevPlayer,
        characterClass: classes.find((cls) => cls.index === classIndex),
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData((prevPlayer) => ({ ...prevPlayer, [name]: value }));
  };

  const savePlayer = async () => {
    try {
      const playerToSave = { ...playerData, id: null };
      const response = await axios.post(
        "http://localhost:8080/api/players",
        playerToSave,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Player saved:", response.data);
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
          <p>Health: {player.health}</p>
          <p>Constitution: {player.constitution}</p>
          <p>Constitution Modifier: {player.constitutionModifier}</p>
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
