import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPlayer, fetchClasses, fetchClassDetails } from "../store/Store";
import "./player.css";
import PlayerClassCarousel from "../PlayerClassCarousel/PlayerClassCarousel";
import ParchmentBox from "../parchmentBox/ParchmentBox";
import AbilityScoreAssignment from "../abilityScoreAssignment/AbilityScoreAssignment";

const classImages = {
  fighter: "/assets/playerCharacters/fighter/fighter-serious.png",
  barbarian: "/assets/playerCharacters/barbarian/barbarian-happy.png",
  wizard: "/assets/playerCharacters/wizard/wizard-serious.png",
  rogue: "/assets/playerCharacters/rogue/rogue-serious.png",
  ranger: "/assets/playerCharacters/ranger/ranger-happy.png",
  monk: "/assets/playerCharacters/monk/monk-serious.png",
  bard: "/assets/playerCharacters/bard/bard-serious.png",
};

const PlayerComponent = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const classes = useSelector((state) => state.class.classes);
  const selectedClass = useSelector((state) => state.class.selectedClass);

  const [playerData, setPlayerData] = useState({
    name: "",
    characterClass: null,
    characterImage: null,
  });
  const [generatedScores, setGeneratedScores] = useState([]);
  const [abilities, setAbilities] = useState([
    { name: "Strength", assignedScore: null },
    { name: "Dexterity", assignedScore: null },
    { name: "Constitution", assignedScore: null },
    { name: "Intelligence", assignedScore: null },
    { name: "Wisdom", assignedScore: null },
    { name: "Charisma", assignedScore: null },
  ]);
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const [isScoreGenerated, setIsScoreGenerated] = useState(false);

  useEffect(() => {
    if (classes.length === 0) {
      dispatch(fetchClasses());
    }
  }, [dispatch, classes.length]);

  useEffect(() => {
    console.log("Selected Class:", selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    setPlayerData({
      ...playerData,
      name: "",
      characterClass: null,
      characterImage: null,
    });
  }, []);

  const handleClassChange = (classIndex) => {
    if (classIndex) {
      const selectedClass = classes.find((cls) => cls.index === classIndex);

      if (selectedClass) {
        dispatch(fetchClassDetails(classIndex));

        setPlayerData((prevPlayer) => ({
          ...prevPlayer,
          characterClass: selectedClass,
          characterImage: classImages[selectedClass.index],
        }));
      }
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
      setIsScoreGenerated(true);
    } catch (error) {
      console.error("Error generating scores:", error);
    }
  };

  const onScoreAssign = (updatedAbilities, updatedScores) => {
    setAbilities(updatedAbilities);
    setGeneratedScores(updatedScores);

    const allAssigned = updatedAbilities.every(
      (ability) => ability.assignedScore !== null
    );
    if (allAssigned) {
      setIsReadyToSave(true);
    } else {
      setIsReadyToSave(false);
    }
  };

  const savePlayer = async () => {
    try {
      const characterClass = playerData.characterClass;
      const characterImage = characterClass
        ? classImages[characterClass.index]
        : null;

      const playerToSave = {
        name: playerData.name, // Ensure only necessary fields are sent
        characterClass: characterClass,
        characterImage: characterImage,
      };

      console.log("Player data before sending:", playerToSave);

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
      if (response.data.name && response.data.characterClass) {
        setIsReadyToSave(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("A player with this name already exists.");
        alert(
          "A player with this name already exists. Please choose a different name."
        );
      } else {
        console.error("Error saving player:", error);
      }
    }
  };

  const finalizeScores = () => {
    const abilityScores = {
      strength: abilities.find((a) => a.name === "Strength").assignedScore,
      dexterity: abilities.find((a) => a.name === "Dexterity").assignedScore,
      constitution: abilities.find((a) => a.name === "Constitution")
        .assignedScore,
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

  const saveAbilityScores = async (playerId, abilityScores) => {
    try {
      console.log("Ability Scores being sent:", abilityScores);
      const response = await axios.put(
        `http://localhost:8080/api/players/id/${playerId}/update-scores`,
        abilityScores, // Sending only the ability scores
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Player updated with new ability scores:", response.data);
      dispatch(setPlayer(response.data));
      setPlayerData(response.data);
    } catch (error) {
      console.error("Error updating ability scores:", error);
    }
  };

  return (
    <div className="player-container">
      <h2>Create Player</h2>
      <img src="../../../backgrounds/ruins.png" className="ruins" alt="ruins" />
      <PlayerClassCarousel
        onClassChange={handleClassChange}
        selectedClass={
          playerData.characterClass ? playerData.characterClass.index : ""
        }
      />
      <div className="player-form">
        <div>
          <label className="player-name">
            <input
              type="text"
              name="name"
              value={playerData.name || ""}
              onChange={handleInputChange}
            />
          </label>
        </div>
        {/* Save Player Button will only be enabled if all fields are valid */}
        <button onClick={savePlayer} disabled={!isReadyToSave}>
          Save Player
        </button>
      </div>
      <div className="">
        <ParchmentBox className={""}>
          <div className="player-info-player-pic">
            <div className="player-info">
              <h3>Player Info</h3>
              <p>Name: {playerData.name}</p>
              <p>Class: {selectedClass ? selectedClass.name : "N/A"}</p>
              <p>Health: {player.health}</p>
              <p>
                Constitution: {player.constitution}
                <span className="modifier">
                  {" "}
                  +{player.constitutionModifier}
                </span>
              </p>
              <p>
                Strength: {player.strength}
                <span className="modifier"> +{player.strengthModifier}</span>
              </p>
              <p>
                Dexterity: {player.dexterity}
                <span className="modifier"> +{player.dexterityModifier}</span>
              </p>
              <p>
                Intelligence: {player.intelligence}
                <span className="modifier">
                  {" "}
                  +{player.intelligenceModifier}
                </span>
              </p>
              <p>
                Wisdom: {player.wisdom}
                <span className="modifier"> +{player.wisdomModifier}</span>
              </p>
              <p>
                Charisma: {player.charisma}
                <span className="modifier"> +{player.charismaModifier}</span>
              </p>
            </div>
            <div className="picture-side">
              {playerData.characterImage && (
                <img
                  src={playerData.characterImage}
                  className="character-image"
                />
              )}
            </div>
          </div>

          {selectedClass && (
            <div className="class-info">
              <h3>Class Info</h3>
              <p>Name: {selectedClass.name}</p>
              <p>Hit Die: {selectedClass.hit_die}</p>
              <h4>Equipment</h4>
              <ul>
                {selectedClass.starting_equipment &&
                selectedClass.starting_equipment.length > 0 ? (
                  selectedClass.starting_equipment.map((item, index) => (
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
          <div className="generate-ability-scores">
            {!isScoreGenerated && (
              <button onClick={generateScores}>Generate Ability Scores</button>
            )}
            <AbilityScoreAssignment
              generatedScores={generatedScores}
              abilities={abilities}
              onScoreAssign={onScoreAssign}
            />
            {/* Finalize button to submit the ability scores */}
            <button onClick={finalizeScores}>Finalize Scores</button>
          </div>
        </ParchmentBox>
      </div>
    </div>
  );
};

export default PlayerComponent;
