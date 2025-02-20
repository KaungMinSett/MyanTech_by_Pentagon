import React from "react";

export const Pagination = ({ totalPages, currentPage, onPageChange }) => (
  <div className="flex justify-center mt-4 gap-2">
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === index + 1
            ? "bg-indigo-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
);
