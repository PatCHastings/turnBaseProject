import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./navbar.css";

function Navbar() {
  const player = useSelector((state) => state.player);
  const enemy = useSelector((state) => state.enemy);

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to={player.name ? "/player" : "/createPlayer"}>
            {player ? "Player" : "Create Player"}
          </Link>
        </li>
        <li>
          <Link to="/Fight">Fight</Link>
        </li>
        <li>
          <Link to={enemy.enemyName ? "/enemy" : "/createEnemy"}>
            {enemy ? "Enemy" : "Generate Enemy"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
