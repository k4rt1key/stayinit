import React from "react";
import { List, Text } from "./";
function PropertyInfoBoxes({ PropertyInfo }) {
  return (
    <div className="w-full flex flex-row gap-6 flex-wrap">
      {PropertyInfo.map((x) =>
        x.value === true || x.value !== undefined ? (
          <div
            key={x.name + Math.random()}
            className="flex flex-row gap-6 rounded-md w-full bg-gray-200  p-2 items-center justify-between"
          >
            <div className="flex flex-row justify-between gap-6 p-2">
              <span>{x.name.toUpperCase()}</span>
              <span className="font-bold">
                {typeof x.value === "boolean"
                  ? ""
                  : x.value?.toString().toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <React.Fragment key={x.name + Math.random()} />
        )
      )}
    </div>
  );
}

export default PropertyInfoBoxes;
