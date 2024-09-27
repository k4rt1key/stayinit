import { Link } from "react-router-dom";

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/Auth";
import { useNavigate } from "react-router-dom";

import { Img, Text } from "../components";
import ImageGallary from "../components/ImageGallary";

const LandingPageCardForOwner = ({
  flat,
  className,
  handleEdit,
  handleDelete,
}) => {
  const { authData } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    uniqueName,
    name,
    type,
    price,
    city,
    locality,
    bhk,
    bathrooms,
    sqft,
    balconies,
    images,
  } = flat;

  console.log(flat);
  console.log("flat");
  return (
    <>
      <div className={className}>
        <div className="relative ">
          <ImageGallary
            imageClassName="aspect-w-16 aspect-h-9 h-[256px] object-cover w-full z-10"
            images={images}
          />
        </div>
        <div className="bg-white border border-red-101 border-solid flex flex-col items-start justify-start px-5 py-[30px] rounded-bl-[10px] rounded-br-[10px] w-full">
          <div className="flex flex-col gap-6 items-start justify-start w-full">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-3 items-center justify-start w-full">
                <Text className="text-xl font-1 font-semibold flex justify-between w-full">
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
                      <span>🛌</span>
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {bhk} Bedroom
                      </Text>
                    </>
                  ) : (
                    <>
                      <span>👥</span>
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
                      <span>🚿</span>
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {bathrooms} Baths
                      </Text>
                    </>
                  ) : (
                    <>
                      <span>📶</span>

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
                      <span>🟧</span>
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {sqft} Sqft
                      </Text>
                    </>
                  ) : (
                    <>
                      <span>🫧</span>
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
                      <span>🌄</span>
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        {balconies} Balconies
                      </Text>
                    </>
                  ) : (
                    <>
                      <span>
                        {forWhichGender === "boys"
                          ? "♂️"
                          : forWhichGender === "girls"
                          ? "♀️"
                          : "⚧️"}
                      </span>
                      <Text className="text-sm lg:text-md font-semibold text-gray-700 w-auto">
                        For {forWhichGender}
                      </Text>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* price and details button */}
            <div className="flex flex-col gap-3 items-center justify-between w-full">
              <button
                onClick={handleEdit}
                className="bg-color2 cursor-pointer flex-1 font-semibold py-[13px] rounded-[10px] text-base text-center text-white w-full"
              >
                {"Edit"}
              </button>
              <button
                onClick={handleDelete}
                className="bg-color2 cursor-pointer flex-1 font-semibold py-[13px] rounded-[10px] text-base text-center text-white w-full"
              >
                {"Delete"}
              </button>
              <Link
                to={{
                  pathname: `/listing/${type}/${uniqueName}`,
                  state: { listingSearchParams: searchParams },
                }}
                className="bg-color2 cursor-pointer flex-1 font-semibold py-[13px] rounded-[10px] text-base text-center text-white w-full"
              >
                {"Details"}
              </Link>
              <Text className="text-2xl font-1 font-semibold" size="">
                {price} ₹
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPageCardForOwner;
