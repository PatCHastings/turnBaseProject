import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPlayer, fetchClasses, fetchClassDetails } from "../store/Store";
import "./player.css";
import PlayerClassCarousel from "../PlayerClassCarousel/PlayerClassCarousel";
import ParchmentBox from "../parchmentBox/ParchmentBox";
import AbilityScoreAssignment from "../abilityScoreAssignment/AbilityScoreAssignment";

const PlayerComponent = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const classes = useSelector((state) => state.class.classes);
  const selectedClass = useSelector((state) => state.class.selectedClass);
  const [playerData, setPlayerData] = useState(player);
  const [generatedScores, setGeneratedScores] = useState([]);

  const [abilities, setAbilities] = useState([
    { name: "Strength", assignedScore: null },
    { name: "Dexterity", assignedScore: null },
    { name: "Intelligence", assignedScore: null },
    { name: "Wisdom", assignedScore: null },
    { name: "Charisma", assignedScore: null },
  ]);

  useEffect(() => {
    if (classes.length === 0) {
      dispatch(fetchClasses());
    }
  }, [dispatch, classes.length]);

  useEffect(() => {
    console.log("Selected Class:", selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    // Resets playerData if changing routes to avoid overwriting the player state
    setPlayerData({
      name: "",
      health: null,
      characterClass: null,
    });
  }, []);

  const handleClassChange = (classIndex) => {
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

  const generateScores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/players/generate"
      );
      console.log("Generated scores:", response.data);
      setGeneratedScores(response.data);
    } catch (error) {
      console.error("Error generating scores:", error);
    }
  };

  const onScoreAssign = (updatedAbilities) => {
    setAbilities(updatedAbilities);
  };

  const saveAbilityScores = async (playerId, abilityScores) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/players/id/${playerId}/update-scores`,
        abilityScores
      );
      console.log("Player updated with new ability scores:", response.data);
    } catch (error) {
      console.error("Error updating ability scores:", error);
    }
  };

  const finalizeScores = () => {
    const abilityScores = {
      strength: abilities.find((a) => a.name === "Strength").assignedScore,
      dexterity: abilities.find((a) => a.name === "Dexterity").assignedScore,
      intelligence: abilities.find((a) => a.name === "Intelligence")
        .assignedScore,
      wisdom: abilities.find((a) => a.name === "Wisdom").assignedScore,
      charisma: abilities.find((a) => a.name === "Charisma").assignedScore,
    };

    if (playerData && playerData.id) {
      saveAbilityScores(playerData.id, abilityScores);
    } else {
      console.error("Player ID is not available to save ability scores.");
    }
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
      setPlayerData(response.data);
    } catch (error) {
      console.error("Error saving player:", error);
    }
  };

  return (
    <div className="player-container">
      <h2>Create Player</h2>
      <PlayerClassCarousel
        onClassChange={handleClassChange}
        selectedClass={
          playerData.characterClass ? playerData.characterClass.index : ""
        }
      />

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
        <div></div>
        <button onClick={savePlayer}>Save Player</button>
      </div>
      <div className="">
        <ParchmentBox>
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
              <h4>Equipment</h4>
              {console.log(
                "Selected Class Starting Equipment:",
                selectedClass.starting_equipment
              )}
              <ul>
                {selectedClass.startingEquipment &&
                selectedClass.startingEquipment.length > 0 ? (
                  selectedClass.startingEquipment.map((item, index) => (
                    <li key={index}>
                      {item.equipment.name} (Quantity: {item.quantity})
                    </li>
                  ))
                ) : (
                  <li>None</li>
                )}
              </ul>
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
        </ParchmentBox>
        <div className="generate-ability-scores">
          <button onClick={generateScores}>Generate Ability Scores</button>
          <AbilityScoreAssignment
            generatedScores={generatedScores}
            abilities={abilities}
            onScoreAssign={onScoreAssign}
          />
          {/* Finalize button to submit the ability scores */}
          <button onClick={finalizeScores}>Finalize Scores</button>
        </div>
      </div>
    </div>
  );
};

export default PlayerComponent;
