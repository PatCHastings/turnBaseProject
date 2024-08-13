import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./playerClassCarousel.css";
import fighter from "/playerClasses/fighter.png";
import barbarian from "/playerClasses/barbarian.png";
import bard from "/playerClasses/bard.png";
import rogue from "/playerClasses/rogue.png";
import wizard from "/playerClasses/wizard.png";
import sorcerer from "/playerClasses/sorcerer.png";
import warlock from "/playerClasses/warlock.png";
import cleric from "/playerClasses/cleric.png";
import monk from "/playerClasses/monk.png";
import druid from "/playerClasses/druid.png";
import ranger from "/playerClasses/ranger.png";
import paladin from "/playerClasses/paladin.png";

const PlayerClassCarousel = ({ onClassChange, selectedClass }) => {
  const playerClasses = [
    { name: "Fighter", index: "fighter", image: fighter },
    { name: "Barbarian", index: "barbarian", image: barbarian },
    { name: "Bard", index: "bard", image: bard },
    { name: "Rogue", index: "rogue", image: rogue },
    { name: "Wizard", index: "wizard", image: wizard },
    { name: "Sorcerer", index: "sorcerer", image: sorcerer },
    { name: "Warlock", index: "warlock", image: warlock },
    { name: "Cleric", index: "cleric", image: cleric },
    { name: "Monk", index: "monk", image: monk },
    { name: "Druid", index: "druid", image: druid },
    { name: "Ranger", index: "ranger", image: ranger },
    { name: "Paladin", index: "paladin", image: paladin },
  ];

  return (
    <div className="carousel-container">
      <Swiper
        spaceBetween={10}
        slidesPerView={"auto"}
        loop={true}
        centeredSlides={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
      >
        {playerClasses.map((playerClass, index) => (
          <SwiperSlide key={index}>
            <img
              src={playerClass.image}
              alt={playerClass.name}
              onClick={() => onClassChange(playerClass.index)} // Handle class change
              className={selectedClass === playerClass.index ? "selected" : ""}
            />
            <h3>{playerClass.name}</h3>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PlayerClassCarousel;
