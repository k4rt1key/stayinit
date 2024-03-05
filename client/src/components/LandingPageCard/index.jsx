import React from "react";

import { Button, Img, Text } from "../";
import { useSearchParams, Link } from "react-router-dom";

const LandingPageCard = ({
  className,
  type,
  image,
  name,
  price,
  uniqueName,
  city,
  locality,

  sharing,
  freeLaundry,
  wifiFacility,
  forWhichGender,

  bhk,
  bathrooms,
  sqft,
  balconies,
}) => {
  return (
    <>
      <div className={className}>
        <div className="relative w-full">
          <div className="h-[260px] sm:h-auto object-cover w-fulls bg-gray-500 z-0 absolute top-0 left-0"></div>
          <Img
            className="h-[260px] sm:h-auto object-cover w-full z-10"
            alt="image"
            src={image}
          />
        </div>
        <div className="bg-gray-51 border border-red-101 border-solid flex flex-col items-start justify-start px-5 py-[30px] rounded-bl-[10px] rounded-br-[10px] w-full">
          <div className="flex flex-col gap-6 items-start justify-start w-full">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-3 items-center justify-start w-full">
                <Text className="text-xl font-semibold flex justify-between w-full">
                  <span>{name}</span>
                </Text>
              </div>
              <div className="flex flex-row gap-3 items-center justify-start w-full">
                <Img className="h-4 w-4" src="/images/img_eye.svg" alt="eye" />
                <Text className="text-md flex justify-between w-full">
                  <span>
                    {city?.charAt(0).toUpperCase() + city?.slice(1)},{" "}
                    {locality?.charAt(0).toUpperCase() + locality?.slice(1)}
                  </span>
                </Text>
              </div>
            </div>
            {/* details */}
            <div className="flex text-md flex-col gap-[21px] items-start justify-start w-full">
              <div className="flex flex-row gap-10 items-center justify-between w-full">
                {/*  BHK OR SHARING */}
                <div className="flex flex-1 flex-row gap-3 items-center justify-start w-full">
                  {type !== "hostel" ? (
                    <>
                      <Img
                        className="h-5 w-5"
                        src="/images/img_bookmark.svg"
                        alt="bookmark"
                      />
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {bhk} Bedroom
                      </Text>
                    </>
                  ) : (
                    <>
                      <Img
                        className="h-5 w-5"
                        src="/images/img_bookmark.svg"
                        alt="bookmark"
                      />
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {sharing} Sharing
                      </Text>
                    </>
                  )}
                </div>
                {/* BATHROOMS OR WIFI-FACILITY */}
                <div className="flex flex-1 flex-row gap-3 items-center justify-end w-full">
                  {type !== "hostel" ? (
                    <>
                      <Img
                        className="h-5 w-5"
                        src="/images/img_ticket.svg"
                        alt="ticket"
                      />
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {bathrooms} Baths
                      </Text>
                    </>
                  ) : (
                    <>
                      <Img
                        className="h-5 w-5"
                        src="/images/img_ticket.svg"
                        alt="wifi"
                      />
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {wifiFacility ? "Wifi" : "No Wifi"}
                      </Text>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-10 items-center justify-between w-full">
                {/*  SQFT OR FREELAUNDRY */}
                <div className="flex flex-1 flex-row gap-3 items-center justify-start w-full">
                  {type !== "hostel" ? (
                    <>
                      <Img
                        className="h-5 w-5"
                        src="/images/img_bookmark.svg"
                        alt="bookmark"
                      />
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {sqft} Sqft
                      </Text>
                    </>
                  ) : (
                    <>
                      <Img
                        className="h-5 w-5"
                        src="/images/img_bookmark.svg"
                        alt="bookmark"
                      />
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {freeLaundry ? "Free Laundry" : "No Laundry"}
                      </Text>
                    </>
                  )}
                </div>
                {/* BALCONIES OR FORWHICHGENDER */}
                <div className="flex flex-1 flex-row gap-3 items-center justify-end w-full">
                  {type !== "hostel" ? (
                    <>
                      <Img
                        className="h-5 w-5"
                        src="/images/img_ticket.svg"
                        alt="ticket"
                      />
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {balconies} Balconies
                      </Text>
                    </>
                  ) : (
                    <>
                      <Img
                        className="h-5 w-5"
                        src="/images/img_ticket.svg"
                        alt="wifi"
                      />
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        For {forWhichGender}
                      </Text>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* price and details button */}
            <div className="flex flex-row gap-[31px] items-center justify-between w-full">
              <Link
                to={`/listing/${type}/${uniqueName}`}
                className="bg-gray-900 cursor-pointer flex-1 font-semibold py-[13px] rounded-[10px] text-base text-center text-white w-full"
              >
                {"Details"}
              </Link>
              <Text className="text-2xl font-semibold" size="">
                {price} ₹
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

LandingPageCard.defaultProps = {
  image: "images/img_image_260x384.png",
  type: "flat",
  sqft: 999,
  name: "XYZ",
  city: "city",
  locality: "locality",
  bhk: 3,
  bathrooms: 3,
  balconies: 3,
  price: "9999",
};

export default LandingPageCard;
