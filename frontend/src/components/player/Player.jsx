import React, { useState, useEffect } from "react";
import axios from "axios";

const PlayerComponent = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [player, setPlayer] = useState({
    name: "",
    health: 100,
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
    const classId = e.target.value;

    if (classId) {
      try {
        const classUrl = `http://localhost:8080/api/classes/${classId}`;
        const response = await axios.get(classUrl);
        console.log("Class details fetched:", response.data);
        setSelectedClass(response.data);
      } catch (error) {
        console.error("Error fetching class details:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayer((prevPlayer) => ({ ...prevPlayer, [name]: value }));
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
            value={player.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Select Class:
          <select name="characterClass" onChange={handleClassChange}>
            <option value="">Select a class</option>
            {classes.map((cls, index) => (
              <option key={cls.id || index} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedClass && (
        <div className="class-info">
          <h3>Class Info</h3>
          <p>Name: {selectedClass.name}</p>
          <p>Hit Die: {selectedClass.hitDie}</p>
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
        <p>Name: {player.name}</p>
        <p>Class: {selectedClass ? selectedClass.name : "N/A"}</p>
        <p>Health: {player.health}</p>
      </div>
    </div>
  );
};

export default PlayerComponent;
