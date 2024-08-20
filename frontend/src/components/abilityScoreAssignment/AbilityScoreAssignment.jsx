import React, { useState } from "react";
import "./abilityScoreAssignment.css";

const AbilityScoreAssignment = ({
  generatedScores,
  abilities,
  onScoreAssign,
}) => {
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [usedScores, setUsedScores] = useState([]);

  const handleAssignScore = (score) => {
    if (selectedAbility) {
      const updatedAbilities = abilities.map((a) =>
        a.name === selectedAbility.name ? { ...a, assignedScore: score } : a
      );
      // removes assigned score from generated scores array..
      const updatedScores = [...generatedScores];
      const scoreIndex = updatedScores.indexOf(score);
      if (scoreIndex !== -1) {
        updatedScores.splice(scoreIndex, 1);
      }

      onScoreAssign(updatedAbilities, updatedScores);
      setSelectedAbility(null); // Reset after assigning score
    }
  };

  const isScoreUsed = (score) => usedScores.includes(score);

  return (
    <div className="ability-container">
      {abilities.map((ability) => (
        <div
          key={ability.name}
          className={`ability-slot ${
            selectedAbility && selectedAbility.name === ability.name
              ? "selected-ability"
              : ""
          }`}
          onClick={() => setSelectedAbility(ability)}
        >
          {ability.name}: {ability.assignedScore || "None"}
        </div>
      ))}

      <div className="generated-scores">
        {generatedScores.map((score, index) => (
          <button key={index} onClick={() => handleAssignScore(score)}>
            {score}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AbilityScoreAssignment;
