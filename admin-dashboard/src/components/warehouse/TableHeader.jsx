import React from "react";

export const TableHeader = ({ headers }) => (
  <thead className="bg-gray-50 sticky top-0">
    <tr>
      {headers.map((header) => (
        <th
          key={header}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
);
