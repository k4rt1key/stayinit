import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData, useParams } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

import { Button, Img, Input, List, Text } from "../components";
import ImageGallary from "../components/ImageGallary";
import NearestLandmarksMaps from "../components/NearestLandmarksMaps";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";

import { nanoid } from "nanoid";
import {
  roundToNearestThousand,
  extractCoordinatesFromUrl,
} from "../utils/UtilityFunctions";
import useFetchProperty from "../customHooks/useFetchProperty";
import useFetchPrediction from "../customHooks/useFetchPrediction";
import SuggestedProperties from "../components/SuggestedProperties";
import PropertyInfoBoxes from "../components/PropertyInfoBoxes";

export default function PropertyPage(props) {
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;
  const [property, loading, error] = useFetchProperty();
  // const property = useLoaderData();
  const type = property?.type || useParams().type;

  //// --- likes
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const [likeLoading, setLikeLoading] = useState(false);

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
    } else {
      searchParams.set("return-url", window.location.pathname);
      setSearchParams({ returnUrl: window.location.pathname });
      navigate("/login");
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

  let PropertyInfo = [];
  if (type === "hostel") {
    PropertyInfo = [
      {
        name: "🧑🏻‍🤝‍🧑🏻 For ",
        value: property.forWhichGender,
      },
      {
        name: "🛗 Lift",
        value: property.liftFacility,
      },
      {
        name: "🛜 Free Wifi",
        value: property.wifiFacility,
      },
      {
        name: "🏋🏻 Gym",
        value: property.gymFacility,
      },
      {
        name: "❄️ Ac Rooms",
        value: property.acFacility,
      },
      {
        name: "🎮 Gaming Room",
        value: property.gamingRoom,
      },
      {
        name: "🧺 Laundry Avilable",
        value: property.freeLaundry,
      },
      {
        name: "👮🏻 Security Guard",
        value: property.securityGuard,
      },
      {
        name: "🚰 Filter Water",
        value: property.filterWater,
      },
      {
        name: "📹 CCTV Monitoring",
        value: property.cctv,
      },
      {
        name: "🧹 Regular Cleaning",
        value: property.cleaning,
      },
    ];
  }
  if (type === "flat") {
    PropertyInfo = [
      { name: "Sqft", value: property.sqft },
      { name: "Furniture", value: property.furnitureType },
      { name: "Floor", value: property.atWhichFloor },
      { name: "Total Floor", value: property.totalFloor },
      { name: "Bathrooms", value: property.bathrooms },
      { name: "Balconies", value: property.balconies },
    ];
  }

  // output prediction price state which we will be show to users
  const [showPrediction, setShowPrediction] = React.useState(false);
  const [prediction, predictionLoading, predictionError] =
    useFetchPrediction(property);

  // suggested properties

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="green" className="h-16 w-16" />
      </div>
    );
  } else {
    return (
      <>
        <div className="px-[1.5rem] lg:px-[10rem] py-[0.5rem] flex flex-col gap-10 items-start justify-start w-full">
          {/* part - 1 properties's info */}
          <div className="flex flex-col gap-10 items-start justify-start w-full">
            {/* images */}
            <div className="w-full relative">
              <ImageGallary
                imageClassName={
                  "h-auto w-full h-[250px] md:h-[500px] max-w-full rounded-lg  object-cover"
                }
                images={property?.images}
              />
            </div>
            {/* property's info cards */}
            <div className="flex xl:flex-row flex-col gap-6 items-start justify-center w-full">
              {/* property's info cards */}
              <div className="flex flex-1 flex-col gap-6 items-start justify-start w-full">
                {/* price wishlist title description */}
                <div className="bg-white border-2 border-[#073937] border-solid flex flex-col items-start justify-start p-4 lg:p-10 sm:px-5 rounded-[10px] w-full">
                  <div className="flex flex-col gap-11 items-start justify-start w-full">
                    <div className="flex flex-col gap-6 items-start justify-start w-full">
                      {/* name and address */}
                      <div className="flex flex-col gap-4 items-start justify-start w-full">
                        <Text className="text-xl lg:text-3xl font-semibold leading-[135.00%]">
                          {property.name}{" "}
                          {type === "flat" ? `- by ${property.developer}` : ""}
                        </Text>
                        <Text className="text-gray-900 text-xl tracking-[-0.40px] w-full">
                          {property.address}, {property.locality},{" "}
                          {property.city}, {property.pincode}
                        </Text>
                      </div>
                      <div className="flex gap-4 w-full">
                        {/* wishlist button */}
                        <button
                          onClick={() => toggleLike(property._id)}
                          className="text-xl flex flex-row gap-4 w-full justify-center border-2 p-3 text-white bg-colorG items-center font-semibold rounded-lg"
                        >
                          {likedProperty.includes(property._id)
                            ? "🤍 Add  to Wishlist"
                            : "❤️ Remove to Wishlist"}
                        </button>
                        {/* Prediction price */}
                        {property.type === "flat" && (
                          <button
                            className="flex flex-row gap-4 w-full justify-center
                    border-2 p-4 border-black bg-gray-200 items-center
                    text-black font-semibold rounded-lg"
                            onClick={() => {
                              if (!isAuthenticate) {
                                searchParams.set(
                                  "return-url",
                                  window.location.pathname
                                );
                                setSearchParams({
                                  returnUrl: window.location.pathname,
                                });
                                navigate("/login");
                              }
                              setShowPrediction(true);
                            }}
                          >
                            {showPrediction === false
                              ? "See Expected Price"
                              : `Price Should be between ${roundToNearestThousand(
                                  prediction * 0.95
                                )} - ${roundToNearestThousand(
                                  prediction * 1.05
                                )} Rupees`}
                          </button>
                        )}
                      </div>
                      {/* pricing */}
                      <div className="flex flex-row flex-wrap gap-4 items-center justify-center w-full">
                        {type === "flat" ? (
                          <div className="bg-white border-2 border-black border-solid flex flex-col items-center justify-center sm:px-5 px-6 py-[7px] rounded-[10px] w-full">
                            <div className="flex flex-col gap-1 items-center justify-center">
                              <Text className="text-2xl lg:text-3xl text-gray-900 font-semibold sm:text-xl tracking-[-0.48px] w-full">
                                ₹{property.price}
                              </Text>
                              <Text className="text-md lg:text-2xl w-full">
                                For {property.bhk} BHK
                              </Text>
                            </div>
                          </div>
                        ) : (
                          <>
                            {property?.priceAndSharing?.map((x) => {
                              return (
                                <div
                                  key={nanoid()}
                                  className="bg-white border border-gray-600 border-solid flex flex-1 flex-col items-center justify-center sm:px-5 px-6 py-[7px] rounded-[10px] w-full"
                                >
                                  <div className="flex flex-col gap-1 items-center justify-center w-full">
                                    <Text className="text-2xl md:text-[22px] text-gray-900 font-semibold sm:text-xl tracking-[-0.48px] w-full">
                                      ₹{x.price}
                                    </Text>
                                    <Text className="text-gray-600 text-md w-full">
                                      For {x.sharing} Sharing
                                    </Text>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                    {/* sqft + description */}
                    <div className="flex flex-col gap-4 items-start justify-start w-full">
                      {type === "flat" ? (
                        <Text className="text-lg lg:text-xl font-semibold leading-[135.00%]">
                          Well-constructed {property.sqft} Sq Ft Home Is Now
                          Offering To You In Uttara For Sale
                        </Text>
                      ) : (
                        <></>
                      )}
                      <Text className="leading-[180.00%] max-w-[712px] md:max-w-full">
                        <div className="text-md">{property.description}</div>
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="bg-white border-2 border-[#073937] border-solid flex flex-col items-start justify-start p-4 lg:p-10 sm:px-5 rounded-[10px] w-full">
                  <NearestLandmarksMaps property={property} />
                </div>

                {/* agent */}
                <div className="bg-white border-2 border-[#073937] border-solid flex flex-col items-start justify-start p-4 lg:p-10 rounded-[10px] w-full">
                  <div className="flex flex-col gap-[26px] items-start justify-start w-full">
                    <Text className="text-xl md:text-2xl w-full font-semibold">
                      Agent Information
                    </Text>
                    <div className="flex flex-row gap-6 items-center justify-start w-full">
                      <div className="flex flex-col gap-[1rem] items-start justify-start w-auto">
                        {/* addedby - username */}
                        <Text className="text-xl lg:text-2xl">
                          {property?.addedBy?.username}
                        </Text>

                        <div className="flex flex-row gap-2.5 items-start lg:items-center justify-start w-full">
                          <Img
                            className="h-5 w-5"
                            src="/images/img_call.svg"
                            alt="call"
                          />
                          <Text className="text-sm lg:text-xl text-gray-600 w-auto">
                            {property.contactNumber}
                          </Text>
                        </div>
                        <div className="flex flex-row gap-2.5 items-center justify-start w-full">
                          <Img
                            className="h-5 w-5"
                            src="/images/img_mail_gray_600.svg"
                            alt="mail"
                          />
                          <Text className="text-sm lg:text-xl text-gray-600 w-auto">
                            {property.contactEmail}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* suggested properties */}
              {/* highlights */}
              <div className="flex flex-row border-2 border-[#073937] bg-colorY2 rounded-[10px] gap-10 p-8 items-start justify-start w-full xl:w-[450px]">
                <div className="bg-white border-2 border-[#073937] border-solid flex flex-col gap-6 items-start justify-start p-4 lg:p-10 rounded-[10px] w-full">
                  <Text className="text-xl md:text-2xl w-full font-semibold">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Highlights
                  </Text>
                  <div className="flex lg:flex-row flex-col gap-6 items-start justify-start w-full">
                    {/* lists of highlights Or Property Info */}
                    <PropertyInfoBoxes PropertyInfo={PropertyInfo} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SuggestedProperties property={property} />
        </div>
      </>
    );
  }
}
