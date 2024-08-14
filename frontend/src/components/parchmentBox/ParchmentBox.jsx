import React from "react";
import "./parchmentBox.css";

const ParchmentBox = ({ children, className }) => {
  return <div className={`parchment-box ${className}`}>{children}</div>;
};

export default ParchmentBox;
