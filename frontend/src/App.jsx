import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import PlayerComponent from "./components/player/Player";
import EnemyComponent from "./components/enemy/Enemy";
import FightComponent from "./components/fight/Fight.jsx";
import Footer from "./components/footer/Footer.jsx";
import store from "./components/store/Store.js";
import { Provider } from "react-redux";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="body-content">
          <Routes>
            <Route path="/createPlayer" element={<PlayerComponent />} />
            <Route path="/player" element={<PlayerComponent />} />
            <Route path="/fight" element={<FightComponent />} />
            <Route path="/createEnemy" element={<EnemyComponent />} />
            <Route path="/enemy" element={<EnemyComponent />} />
          </Routes>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
