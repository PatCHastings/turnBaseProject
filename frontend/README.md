TurnBaseProject (working title) 

Description
This project is a React-based application for creating and managing players with D&D-inspired character abilities. It features the ability to generate random ability scores, assign them to specific attributes, and save player information. Also generate random monsters from the D&D 5E API. 

Features

Create and manage player characters.
Generate and assign random ability scores.
Save player data to the backend.
Frontend built with React, backend with Spring Boot.

Prerequisites:
Node.js
npm or Yarn
Java 17+
Maven

Getting Started:

Backend:
1a: Clone the repository frontend:
git clone https://github.com/PatCHastings/turnBaseProject.git

1b: Clone the repository backend: 
git clone https://github.com/PatCHastings/turnBase.git

*move the turnBase folder to the "backend" directory from the parent "turnBaseProject". 

2: Navigate to the backend directory:
cd backend

3: Build the project with Maven:
mvn clean install

4: Run the Spring Boot application


Frontend
1: Navigate to the frontend directory:
cd frontend

2: Install dependencies:
npm install
or
yarn install

Start the development server:
npm run dev

Usage
Open your browser and navigate to http://localhost:5174.

Use the UI to create players, generate ability scores, and manage character attributes. Navigate to Enemy to randomly generate a monster via API call to https://www.dnd5eapi.co/


Current Work (In-Progress)

   -Creating fleshed-out Player generation and starting-stats with intuitive UI and asthetics 

   -Creating Monster generation based on player level and stats necessary to implement fight/encounter logic vs player. 


Backlog:

    -Create a route that occurs after player creation that takes the player to the outskirts of a town: This route will serve as a hub for the player, providing access to various locations within the town.

In the town, allow the player to select from different places/routes that will provide respective game content:

Inn & Tavern: A location where the player can rest, recover health, and interact with NPCs.
Arena: A place where the player can engage in combat with random monsters/enemies.


