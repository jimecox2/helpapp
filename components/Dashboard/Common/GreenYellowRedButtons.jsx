//components/Dashboard/GreenYellowRedButtons.jsx
'use client'

import React from 'react';

const GreenYellowRedButtons = ({ buttonColor, execSummary }) => {
  const getButtonColor = () => {
    switch(buttonColor) {
      case "Green": return "bg-green-500";
      case "Yellow": return "bg-yellow-500";
      case "Red": return "bg-red-500";
      case "Blue": return "bg-blue-500";
      case "Not Assessed": return "bg-orange-400";
      default: return "bg-gray-500";
    }
  };

  const getButtonText = () => {
    switch(buttonColor) {
      case "Green": return "";
      case "Yellow": return "";
      case "Red": return "";
      case "Blue": return "";
      case "Not Assessed": return "na";
      default: return "";
    }
  };

  const getTooltipText = () => {
    if (execSummary === "") {
      switch(buttonColor) {
        case "Green": return "Green: Good, no major issues!";
        case "Yellow": return "Yellow: One or more major issues present, no impacts at this time!";
        case "Red": return "Red: Management decisions required, needs attention!";
        case "Blue": return "Awaiting new status!";
        case "Not Assessed": return "Not Assessed";
        default: return "No Health data provided.";
      }
    } else {
      return `${buttonColor}: ${execSummary}`;
    }
  };

  return (
    <div className="relative group">
      <div className={`w-10 h-10 rounded-full ${getButtonColor()} flex items-center justify-center text-white font-bold`}>
        {getButtonText()}
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {getTooltipText()}
      </div>
    </div>
  );
};

export default GreenYellowRedButtons;