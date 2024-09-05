import React, { useState, useEffect } from "react";
import "./textDamageFX.css";

const TextDamageFX = ({ combatLog, characterId }) => {
  const [damagePopups, setDamagePopups] = useState([]);

  useEffect(() => {
    const lastEntry = combatLog[combatLog.length - 1];
    if (lastEntry) {
      const { attackerId, defenderId, damage } = lastEntry;

      if (defenderId === characterId && damage) {
        const id = Math.random().toString(36).substr(2, 9);
        setDamagePopups((prev) => [...prev, { id, damage }]);

        // Remove the popup after 1.5 seconds
        setTimeout(() => {
          setDamagePopups((popups) =>
            popups.filter((popup) => popup.id !== id)
          );
        }, 1500);
      }
    }
  }, [combatLog, characterId]);

  return (
    <>
      {damagePopups.map((popup) => (
        <div
          key={popup.id}
          className="damage-popup"
          style={{ animation: "floatUp 2s ease-out forwards" }}
        >
          -{popup.damage}
        </div>
      ))}
    </>
  );
};

export default TextDamageFX;
