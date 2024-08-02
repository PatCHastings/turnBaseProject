import React from "react";
import { Link } from "react-router-dom";
import { useGame } from "../gameContext/GameContext";
import "./navbar.css";

function Navbar() {
  const { player, enemy } = useGame();

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to={player ? "/player" : "/createPlayer"}>
            {player ? "Player" : "Create Player"}
          </Link>
        </li>
        <li>
          <Link to="/Fight">Fight</Link>
        </li>
        <li>
          <Link to={enemy ? "/enemy" : "/createEnemy"}>
            {enemy ? "Monster" : "Generate Enemy"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
