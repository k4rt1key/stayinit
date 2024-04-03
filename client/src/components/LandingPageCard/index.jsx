import { Link } from "react-router-dom";

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/Auth";
import { useNavigate } from "react-router-dom";

import { Img, Text } from "../";
import ImageGallary from "../ImageGallary";

const LandingPageCard = ({
  _id,
  className,
  type,
  images,
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

  likeLoading,
  setLikeLoading,
  likedProperty,
  setLikedProperty,
  likesLength,
  setLikesLength,
}) => {
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLikedNow, setIsLikedNow] = useState(false);
  const navigate = useNavigate();

  async function getLikes() {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/likes`,
        requestOptions
      );
      const jsonResponse = await response.json();
      const data = jsonResponse.data;

      if (jsonResponse.success === true) {
        const newList = [];
        data.forEach((like) => {
          like.hostel ? newList.push(like?.hostel?._id) : null;
          like.flat ? newList.push(like?.flat?._id) : null;
        });

        setLikedProperty(newList);
      } else {
        toast.error(jsonResponse.message);
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

  React.useEffect(() => {
    if (isAuthenticate) {
      setLikeLoading(true);
      getLikes();
      setLikeLoading(false);
    }
  }, [likesLength, isAuthenticate]);

  function toggleLike(_id) {
    if (isAuthenticate) {
      if (likedProperty.includes(_id)) {
        setIsLikedNow(false);
        unlike(_id);
      } else {
        setIsLikedNow(true);
        like(_id);
      }
    } else {
      navigate("/login", { state: { returnUrl: window.location.pathname } });
    }
  }

  async function unlike(_id) {
    try {
      if (isAuthenticate) {
        const responseOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        setLikeLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/likes/${type}/${_id}`,
          responseOptions
        );
        const jsonResponse = await response.json();
        setLikeLoading(false);

        if (jsonResponse.success === true) {
          setLikedProperty(() => {
            return likedProperty.filter((property) => {
              return property !== _id;
            });
          });

          setLikesLength((prev) => {
            return prev - 1;
          });
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function like(_id) {
    try {
      if (isAuthenticate) {
        const bodyData = {
          propertyId: _id,
          type: type,
        };

        const requestObject = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyData),
        };

        setLikeLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/likes`,
          requestObject
        );
        const jsonResponse = await response.json();
        setLikeLoading(false);

        if (jsonResponse.success === true) {
          setLikedProperty((prev) => {
            const newList = [...prev];
            newList.push(_id);
            return newList;
          });

          setLikesLength((prev) => {
            return prev + 1;
          });
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  return (
    <>
      <div className={className}>
        <div className="relative bg-color1 w-full">
          {/* <Img
            className=""
            alt="image"
            src={image}
          /> */}
          <ImageGallary
            imageClassName="aspect-w-16 aspect-h-9 h-[256px] object-cover w-full z-10"
            images={images}
          />
        </div>
        <div className="bg-white border border-red-101 border-solid flex flex-col items-start justify-start px-5 py-[30px] rounded-bl-[10px] rounded-br-[10px] w-full">
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
              <Link
                to={{
                  pathname: `/listing/${type}/${uniqueName}`,
                  state: { listingSearchParams: searchParams },
                }}
                className="bg-color2 cursor-pointer flex-1 font-semibold py-[13px] rounded-[10px] text-base text-center text-white w-full"
              >
                {"Details"}
              </Link>
              <button
                onClick={() => {
                  toggleLike(_id);
                }}
                className="flex w-full flex-row gap-4 justify-center border-2 p-2 border-gray-400 bg-gray-200 items-center text-black font-semibold rounded-lg"
              >
                <img
                  className="h-8 w-8"
                  src={
                    likedProperty?.includes(_id) || isLikedNow
                      ? "/images/liked.png"
                      : "/images/like.png"
                  }
                  alt=""
                />
                {"Wishlist"}
              </button>
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

export default LandingPageCard;
