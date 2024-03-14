import React, { useState } from "react";

import { extractCoordinatesFromUrl } from "../utils/UtilityFunctions";

import { Button, Text } from "../components";

export default function NearestLandmarksMap({ property }) {
  const addressCordinates = extractCoordinatesFromUrl(property?.addressLink);
  const lat = addressCordinates?.split(",")[0];
  const long = addressCordinates?.split(",")[1];
  const { city, locality, uniquename, name } = property;
  const [mapString, setMapString] = useState(`${lat},${long}`);
  const [mapStringNumber, setMapStringNumber] = useState(0);
  const iframes = [
    <iframe
      src={`https://www.google.com/maps/embed/v1/search?q=${`${lat},${long}`}&key=AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4`}
      className="h-full w-full"
    ></iframe>,
    <iframe
      src={`https://www.google.com/maps/embed/v1/search?q=${`cafes around 10km of ${lat},${long},${locality},${city}`}&key=AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4`}
      className="h-full w-full"
    ></iframe>,
    <iframe
      src={`https://www.google.com/maps/embed/v1/search?q=${`bus transportations near ${lat},${long},${locality},${city}`}&key=AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4`}
      className="h-full w-full"
    ></iframe>,
    <iframe
      src={`https://www.google.com/maps/embed/v1/search?q=${`${lat},${long} to ${city} railway station`}&key=AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4`}
      className="h-full w-full"
    ></iframe>,
  ];
  return (
    <div className="flex flex-col gap-6 items-start justify-start w-full">
      <div className="flex flex-col gap-6 items-start justify-start w-full">
        <Text className="text-lg lg:text-xl font-semibold leading-[135.00%]">
          Local Information
        </Text>
        {/* 4 buttons */}
        <div className="gap-3 grid grid-cols-1 md:grid-cols-4 items-center justify-center  w-full">
          <Button
            onClick={() => {
              setMapStringNumber(0);
            }}
            className={`${
              mapStringNumber === 0 ? "bg-color2 text-white " : "text-gray-900"
            } border border-bluegray-100 border-solid cursor-pointer flex-1 font-semibold py-[11px] rounded-[10px] text-base text-center  w-full`}
          >
            Map
          </Button>
          <Button
            onClick={() => {
              setMapStringNumber(1);
            }}
            className={`${
              mapStringNumber === 1 ? "bg-color2 text-white " : "text-gray-900"
            } border border-bluegray-100 border-solid cursor-pointer flex-1 font-semibold py-[11px] rounded-[10px] text-base text-center  w-full`}
          >
            Cafes
          </Button>
          <Button
            onClick={() => {
              setMapStringNumber(2);
            }}
            className={`${
              mapStringNumber === 2 ? "bg-color2 text-white " : "text-gray-900"
            } border border-bluegray-100 border-solid cursor-pointer flex-1 font-semibold py-[11px] rounded-[10px] text-base text-center  w-full`}
          >
            Bus Transportation
          </Button>
          <Button
            onClick={() => {
              setMapStringNumber(3);
            }}
            className={`${
              mapStringNumber === 3 ? "bg-color2 text-white " : "text-gray-900"
            } border border-bluegray-100 border-solid cursor-pointer flex-1 font-semibold py-[11px] rounded-[10px] text-base text-center  w-full`}
          >
            Railway-Station
          </Button>
        </div>
      </div>
      <div className="h-[400px] border-2 border-black relative w-full">
        {mapStringNumber !== -1 ? (
          iframes[mapStringNumber]
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-400">
            {" "}
            Explore Maps, Cafes, Public transports & Railway Station nearby this
            property
          </div>
        )}
      </div>
    </div>
  );
}
