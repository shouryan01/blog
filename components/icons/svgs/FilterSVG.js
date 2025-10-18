import React from 'react';

const FilterSVG = ({ className = "h-5 w-5", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
);

export default FilterSVG;
