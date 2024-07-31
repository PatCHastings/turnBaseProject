import React, { useState } from "react";
import axios from "axios";

const PlayerComponent = () => {
  const [player, setPlayer] = useState(null);
  const [userName, setUserName] = useState("");
  const [characterClass, setCharacterClass] = useState("");

  const createPlayer = async () => {
    const response = await axios.post("http://localhost:8080/api/players", {
      userName,
      characterClass,
      health: 100,
    });
    setPlayer(response.data);
  };

  return (
    <div>
      <h2>Create Player</h2>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Character Class"
        value={characterClass}
        onChange={(e) => setCharacterClass(e.target.value)}
      />
      <button onClick={createPlayer}>Create Player</button>

      {player && (
        <div>
          <h3>Player Info</h3>
          <p>Username: {player.userName}</p>
          <p>Character Class: {player.characterClass}</p>
          <p>Health: {player.health}</p>
        </div>
      )}
    </div>
  );
};

export default PlayerComponent;
