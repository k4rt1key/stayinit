import React from "react";

function PropertyInfoBoxes({ PropertyInfo }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PropertyInfo.map((x) =>
        x.value === true || x.value !== undefined ? (
          <div
            key={x.name + Math.random()}
            className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{x.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {x.name}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {typeof x.value === "boolean"
                ? x.value
                  ? "Yes"
                  : "No"
                : x.value?.toString()}
            </span>
          </div>
        ) : null
      )}
    </div>
  );
}

export default PropertyInfoBoxes;
