import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { Button, Img, Text } from "../components";
import LandingPageCard from "../components/LandingPageCard";

import useFetchLikes from "../customHooks/useFetchLikes";

export default function likes() {
  const navigate = useNavigate();
  // auth data
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;

  // likes
  const [likeLoading, setLikeLoading] = useState(false);
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const [likes, loading, error] = useFetchLikes(likesLength);

  const likeArrayProps = likes.map((l) => {
    console.log(l);
    if (l?.type === "hostel") {
      return {
        _id: l?.hostel?._id,
        images: l?.hostel?.images,
        city: l?.hostel?.city,
        locality: l?.hostel?.locality,
        uniqueName: l?.hostel?.uniqueName,
        name: l?.hostel?.name,
        price: l?.hostel?.priceAndSharing[0].price,
        sharing: l?.hostel?.priceAndSharing[0].sharing,
        freeLaundry: l?.hostel?.freeLaundry,
        wifiFacility: l?.hostel?.wifiFacility,
        forWhichGender: l?.hostel?.forWhichGender,
        type: "hostel",

        likeLoading,
        setLikeLoading,
        likedProperty,
        setLikedProperty,
        likesLength,
        setLikesLength,
      };
    } else {
      return {
        _id: l?.flat?._id,
        images: l?.flat?.images,
        city: l?.flat?.city,
        locality: l?.flat?.locality,
        uniqueName: l?.flat?.uniqueName,
        name: l?.flat?.name,
        price: l?.flat?.price,
        bhk: l?.flat?.bhk,
        bathrooms: l?.flat?.bathrooms,
        sqft: l?.flat?.sqft,
        balconies: l?.flat?.balconies,
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

  if (!isAuthenticate) {
    navigate("/login", { state: { returnUrl: window.location.pathname } });
  }

  if (!loading) {
    if (likeArrayProps.length === 0) {
      return (
        <div className="flex gap-4 flex-col justify-center items-center h-screen">
          <Text size="lg" className="text-center font-1 text-3xl">
            You have not liked any properties yet
          </Text>
          <div className="flex gap-4">
            <Link
              to="/listing/flat"
              className="px-4 py-2 bg-color2 text-white w-[10rem] text-center rounded-md mt-4"
            >
              Go to Flats
            </Link>
            <Link
              className="px-4 py-2 bg-color2 text-white w-[10rem] text-center rounded-md mt-4"
              to="/listing/hostel"
            >
              Go to Hostels
            </Link>
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="px-[1.5rem] lg:px-[10rem] py-[2rem] flex flex-col sm:gap-10 md:gap-10 gap-[100px] items-start justify-start w-auto sm:w-full md:w-full">
          <div className="flex flex-col gap-10 items-center justify-center w-full">
            {/* page header and filters */}
            <div className="flex flex-col gap-6 items-center justify-center max-w-[1200px] mx-auto w-full">
              <Text
                className="text-4xl font-1 sm:text-[32px] md:text-[34px] text-gray-900 tracking-[-0.72px] w-full"
                size=""
              >
                Liked Property
              </Text>

              {/* cards and map view */}
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col gap-6 items-start justify-center max-w-[1200px]  w-full">
                  {/* cards */}
                  <div className="flex flex-col gap-10 items-start justify-start w-full">
                    {/* cards */}
                    <div className="flex flex-col items-start justify-start w-full">
                      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 justify-center w-full">
                        {likeArrayProps.map((props, index) => (
                          <div
                            className="relative"
                            key={`LandingPageCard${index}`}
                          >
                            <LandingPageCard {...props} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* page & nextpage */}
                    {/* <div className="flex flex-col md:flex-row gap-5 items-center justify-between w-full">
                      <div className="flex flex-row gap-6 items-start justify-start w-auto">
                        <Button className="border border-gray-700 border-solid cursor-pointer font-semibold h-12 py-[13px] rounded-[10px] text-base text-center text-gray-900 w-12">
                          1
                        </Button>
                        <Button className="border border-bluegray-102 border-solid cursor-pointer font-semibold h-12 py-[13px] rounded-[10px] text-base text-center text-gray-900 w-12">
                          2
                        </Button>
                        <Button className="border border-bluegray-102 border-solid cursor-pointer font-semibold h-12 py-[13px] rounded-[10px] text-base text-center text-gray-900 w-12">
                          3
                        </Button>
                      </div>

                      <Button
                        className="border border-bluegray-102 border-solid cursor-pointer flex items-center justify-center min-w-[134px] px-[17px] py-[13px] rounded-[10px]"
                        rightIcon={
                          <Img
                            className="h-4 mt-px mb-[5px] ml-1"
                            src="/images/img_arrowright_gray_900.svg"
                            alt="arrow_right"
                          />
                        }
                      >
                        <div className="font-semibold text-base text-gray-900 text-left">
                          Next Page
                        </div>
                      </Button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="green" className="h-16 w-16" />
      </div>
    );
  }
}
