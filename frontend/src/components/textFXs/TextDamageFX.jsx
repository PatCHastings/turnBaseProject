import React, { useState, useEffect } from "react";
import "./textDamageFX.css";

const TextDamageFX = ({ combatLog }) => {
  const [damagePopups, setDamagePopups] = useState([]);

  useEffect(() => {
    if (combatLog.length > 0) {
      const lastEntry = combatLog[combatLog.length - 1];
      if (lastEntry.includes("damage")) {
        const damage = extractDamageFromLog(lastEntry);
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
  }, [combatLog]);

  const extractDamageFromLog = (logEntry) => {
    // Extract the damage value from the log entry
    const match = logEntry.match(/(\d+) damage/);
    return match ? match[1] : null;
  };

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
