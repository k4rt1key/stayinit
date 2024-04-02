import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { Button, Text, Img } from "../components";
import LandingPageCard from "./LandingPageCard";
import useFetchFeatured from "../customHooks/useFetchFeatured";
import { useAuth } from "../contexts/Auth";
import { Spinner } from "@material-tailwind/react";

export default function SuggestedProperties() {
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;

  const [properties, loading, error] = useFetchFeatured();

  //// --- likes
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const [likeLoading, setLikeLoading] = useState(false);

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
          if (type === "hostel") {
            like.hostel ? newList.push(like?.hostel?._id) : null;
          } else {
            like.flat ? newList.push(like?.flat?._id) : null;
          }
        });

        setLikedProperty(newList);
      }
    } catch (error) {
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
        unlike(_id);
      } else {
        like(_id);
      }
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

  ///// --- likes
  const landingPageCardPropList = properties.map((property) => {
    if (property.type === "hostel") {
      return {
        _id: property._id,
        images: property.images,
        city: property.city,
        locality: property.locality,
        uniqueName: property.uniqueName,
        name: property.name,
        price: property.priceAndSharing[0].price,
        sharing: property.priceAndSharing[0].sharing,
        freeLaundry: property.freeLaundry,
        wifiFacility: property.wifiFacility,
        forWhichGender: property.forWhichGender,
        type: "hostel",

        setLikeLoading,
        likedProperty,
        setLikedProperty,
        likesLength,
        setLikesLength,
      };
    } else {
      return {
        _id: property._id,
        images: property.images,
        city: property.city,
        locality: property.locality,
        uniqueName: property.uniqueName,
        name: property.name,
        price: property.price,
        bhk: property.bhk,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        balconies: property.balconies,
        type: "flat",

        likeLoading,
        setLikeLoading,
        likedProperty,
        setLikedProperty,
        likesLength,
        setLikesLength,
      };
    }
  });
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col md:gap-10 gap-[60px] md:h-auto items-start justify-start max-w-[1200px] mx-auto w-full">
        {/* featured property - title  */}
        <div className="flex flex-col gap-6 items-start justify-start w-full">
          <div className="flex flex-col gap-10 items-center justify-between w-full">
            <Text className="text-2xl md:text-4xl sm:text-[32px] md:text-[34px] text-gray-900 tracking-[-0.72px] w-auto">
              Featured Hostels
            </Text>
            <Button
              className="common-pointer bg-transparent cursor-pointer flex items-center justify-center min-w-[124px]"
              onClick={() => navigate("/listing/hostel")}
              rightIcon={
                <Img
                  className="h-6 mb-[3px] ml-2"
                  src="/images/img_arrowright.svg"
                  alt="arrow_right"
                />
              }
            >
              <Link
                to="/listing/hostel"
                className="font-bold text-left text-lg text-orange-A700"
              >
                Explore All Hostels
              </Link>
            </Button>
          </div>
        </div>

        {/* cards */}
        <div className="flex flex-col items-start justify-start w-full">
          {loading ? (
            <div className="flex items-center h-[20rem] justify-center w-full">
              <Spinner color="green" className="h-16 w-16" />
            </div>
          ) : (
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 justify-center w-full">
              {landingPageCardPropList.map((props, index) => (
                <React.Fragment key={`LandingPageCard${index}`}>
                  <LandingPageCard
                    className="flex flex-col md:h-auto items-start rounded-[1rem] justify-start w-full"
                    {...props}
                  />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
