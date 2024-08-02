import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

//provider component
export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(null);

  const value = {
    player,
    setPlayer,
    enemy,
    setEnemy,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

//custom hook to use the GameContext
export const useGame = () => {
  return useContext(GameContext);
};
