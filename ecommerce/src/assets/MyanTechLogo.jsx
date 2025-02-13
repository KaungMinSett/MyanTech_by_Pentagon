import React from "react";

const MyanTechLogo = ({ className = "" }) => {
  return (
    <svg className={`h-8 w-auto ${className}`} viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Abstract Tech Icon */}
      <g transform="translate(0, 5)">
        <rect x="5" y="5" width="40" height="40" rx="4" fill="currentColor" />

        <path d="M15 15 H35 V25 H25 V35 H35" stroke="white" strokeWidth="3" fill="none" />

        <circle cx="15" cy="15" r="2" fill="white" />
        <circle cx="35" cy="15" r="2" fill="white" />
        <circle cx="25" cy="25" r="2" fill="white" />
        <circle cx="25" cy="35" r="2" fill="white" />
        <circle cx="35" cy="35" r="2" fill="white" />

        <path d="M42 20 L48 20 L45 23 L48 20 L45 17" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M42 30 L48 30 L45 33 L48 30 L45 27" stroke="currentColor" strokeWidth="2" fill="none" />
      </g>

      {/* Company name */}
      <text
        x="70"
        y="38"
        className="font-sans"
        fontSize="32"
        fontWeight="700"
        letterSpacing="-0.02em"
        fill="currentColor"
      >
        <tspan>Myan</tspan>
        <tspan fontWeight="600">Tech</tspan>
      </text>
    </svg>
  );
};

export default MyanTechLogo;
