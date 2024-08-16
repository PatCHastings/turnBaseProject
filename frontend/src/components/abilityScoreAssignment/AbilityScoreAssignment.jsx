import React, { useState } from "react";

const AbilityScoreAssignment = ({
  generatedScores,
  abilities,
  onScoreAssign,
}) => {
  const [selectedAbility, setSelectedAbility] = useState(null);

  const handleAssignScore = (score) => {
    if (selectedAbility) {
      const updatedAbilities = abilities.map((a) =>
        a.name === selectedAbility.name ? { ...a, assignedScore: score } : a
      );
      onScoreAssign(updatedAbilities);
      setSelectedAbility(null); // Reset after assigning score
    }
  };

  return (
    <div>
      {abilities.map((ability) => (
        <div
          key={ability.name}
          className="ability-slot"
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
