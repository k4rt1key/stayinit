import { Spinner } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import { toast } from "react-toastify";

import { Button, Img, Text } from "../components";

import LandingPageCard from "../components/LandingPageCard";

function useFetch(likesLength) {
  try {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    async function init() {
      setLoading(true);
      const requestObject = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await fetch(
        `http://localhost:5000/api/v1/likes`,
        requestObject
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success === true) {
        setLikes(jsonResponse.data);
        setLoading(false);
      } else {
        toast.error(jsonResponse.message);
        throw new Error(jsonResponse.message);
      }
    }

    useEffect(() => {
      init();
    }, [likesLength]);

    return { likes, loading, error };
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
}

export default function likes() {
  const [likeLoading, setLikeLoading] = useState(false);

  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const { likes, loading, error } = useFetch(likesLength);

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
        `http://localhost:5000/api/v1/likes`,
        requestOptions
      );
      const jsonResponse = await response.json();
      const data = jsonResponse.data;

      if (jsonResponse.success === true) {
        const newList = [];
        data.forEach((like) => {
          if (like?.hostel !== undefined || like?.hostel !== null) {
            like.hostel ? newList.push(like?.hostel?._id) : null;
          }
          if (like?.flat !== undefined || like?.flat !== null) {
            like.flat ? newList.push(like?.flat?._id) : null;
          }
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
      getLikes();
    }
  }, [likesLength, isAuthenticate]);

  function toggleLike(_id, type) {
    if (isAuthenticate) {
      if (likedProperty.includes(_id)) {
        unlike(_id, type);
      } else {
        like(_id, type);
      }
    }
  }

  async function unlike(_id, type) {
    console.log("type", type);

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
          `http://localhost:5000/api/v1/likes/${type}/${_id}`,
          responseOptions
        );
        const jsonResponse = await response.json();
        setLikeLoading(false);

        if (jsonResponse.success === true) {
          toast.success(jsonResponse.message);
          setLikedProperty(() => {
            return likedProperty.filter((property) => {
              return property !== _id;
            });
          });

          setLikesLength((prev) => {
            return prev - 1;
          });
        } else {
          toast.error(jsonResponse.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

  async function like(_id, type) {
    console.log("type", type);
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
          `http://localhost:5000/api/v1/likes`,
          requestObject
        );
        const jsonResponse = await response.json();
        setLikeLoading(false);

        if (jsonResponse.success === true) {
          toast.success(jsonResponse.message);
          setLikedProperty((prev) => {
            const newList = [...prev];
            newList.push(_id);
            return newList;
          });

          setLikesLength((prev) => {
            return prev + 1;
          });
        } else {
          toast.error(jsonResponse.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

  const likeArrayProps = likes.map((l) => {
    if (l?.hostel !== null && l?.hostel !== undefined) {
      return {
        _id: l?.hostel?._id,
        image: l?.hostel?.images[0],
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
      };
    } else {
      return {
        _id: l?.flat?._id,
        image: l?.flat?.images[0],
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
      };
    }
  });

  if (!loading) {
    return (
      <>
        <div className="px-[0.7rem] lg:px-[10rem] py-[2rem] flex flex-col sm:gap-10 md:gap-10 gap-[100px] items-start justify-start w-auto sm:w-full md:w-full">
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
                            <button
                              onClick={() => toggleLike(props._id, props.type)}
                              className="flex flex-col justify-center absolute top-2 right-2 border-2 p-2 border-black bg-gray-200 items-center text-black font-semibold rounded-lg"
                            >
                              <img
                                className="h-8 w-8"
                                src={
                                  likedProperty.includes(props._id)
                                    ? "/images/liked.png"
                                    : "/images/like.png"
                                }
                                alt=""
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* page & nextpage */}
                    <div className="flex flex-col md:flex-row gap-5 items-center justify-between w-full">
                      {/* Page */}
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

                      {/* Next-Page */}
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
                    </div>
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
