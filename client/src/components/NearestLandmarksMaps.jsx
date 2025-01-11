import React, { useState } from "react";
import { extractCoordinatesFromUrl } from "../utils/UtilityFunctions";
import { Button } from "../components";

export default function NearestLandmarksMap({ property }) {
  const addressCordinates = extractCoordinatesFromUrl(property?.addressLink);
  const lat = addressCordinates?.split(",")[0];
  const long = addressCordinates?.split(",")[1];
  const { city, locality } = property;
  const [mapStringNumber, setMapStringNumber] = useState(0);

  const mapTypes = [
    { name: "Map", query: `${lat},${long}` },
    {
      name: "Cafes",
      query: `cafes around 10km of ${lat},${long},${locality},${city}`,
    },
    {
      name: "Bus",
      query: `bus transportations near ${lat},${long},${locality},${city}`,
    },
    { name: "Railway", query: `${lat},${long} to ${city} railway station` },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-800">
        Local Information
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mapTypes.map((type, index) => (
          <Button
            key={type.name}
            onClick={() => setMapStringNumber(index)}
            className={`py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200 ${
              mapStringNumber === index
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.name}
          </Button>
        ))}
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
        <iframe
          src={`https://www.google.com/maps/embed/v1/search?q=${mapTypes[mapStringNumber].query}&key=AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4`}
          className="w-full h-full border-0"
          allowFullScreen
          // loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
