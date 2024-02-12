import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLoaderData,
  useRevalidator,
} from "react-router-dom";

import { useAuth } from "../contexts/Auth";
import { roundToNearestThousand } from "../utils/utilityFunctions";

import { Spinner } from "@material-tailwind/react";

import FlatInfoCard from "../components/Flat/FlatInfoCard";
import ImageCarousel from "../components/ImageCarousel";
import CommentsDiv from "../components/CommentsDiv";
import NearestLandmarks from "../components/NearestLandmarks";
import { toast } from "react-toastify";

function useFetch(commentsLength) {
  try {
    const params = useParams();
    const { flatname } = params;

    const [flat, setFlat] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function init(flatname) {
      setLoading(true);
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const response = await fetch(
        `http://localhost:5000/api/v1/flat/${flatname}`,
        requestOptions
      );
      const jsonResponse = await response.json();
      console.log("jsonResponse: " + jsonResponse);

      if (jsonResponse.success === true) {
        console.log("flat: " + flat);
        setFlat(jsonResponse.data);
        setLoading(false);
      } else {
        setError(jsonResponse.message);
        toast.error(jsonResponse.message);
        throw new Error(jsonResponse.message);
      }
    }

    useEffect(() => {
      init(flatname);
    }, [params, commentsLength]);

    return { flat, loading, error };
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
}

export default function Flat() {
  const navigate = useNavigate();

  // states for "Authentication" and result of "Predicted Prices"
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;

  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const [likeLoading, setLikeLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // like releted logic --->
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
          like.flat ? newList.push(like.flat._id) : null;
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

  function toggleLike() {
    if (isAuthenticate) {
      if (likedProperty.includes(flat._id)) {
        unlike();
      } else {
        like();
      }
    }
  }

  async function unlike() {
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
          `http://localhost:5000/api/v1/likes/flat/${flat._id}`,
          responseOptions
        );
        const jsonResponse = await response.json();
        setLikeLoading(false);

        if (jsonResponse.success === true) {
          toast.success(jsonResponse.message);
          setLikedProperty(() => {
            return likedProperty.filter((property) => {
              return property !== flat._id;
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

  async function like() {
    try {
      if (isAuthenticate) {
        const bodyData = {
          propertyId: flat._id,
          type: "flat",
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
            newList.push(flat._id);
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

  const [commentsLength, setCommentsLength] = useState(0);
  const { flat, loading, error } = useFetch(commentsLength);
  const [prediction, setPrediction] = useState();

  // function : to predict flat's price range based on flat's attributes
  async function fetchPrediction(flat) {
    try {
      if (authData.isAuthenticate) {
        const response = await fetch("http://localhost:7000/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            property_sqft: flat.sqft,
            property_bhk: flat.bhk,
            property_project: flat.developer.toLowerCase(),
            property_city: flat.city.toLowerCase(),
            property_locality: flat.locality.toLowerCase(),
            is_furnished: flat.furnitureType.toLowerCase(),
            num_of_baths: flat.bathrooms,
            bachelors_or_family: "bachelors",
            floornumber: flat.atWhichFloor,
            totalfloor: flat.totalfloor || flat.atWhichFloor,

            property_pricenan: 0,
            property_bhknan: 0,
            property_sqftnan: 0,
            num_of_bathsnan: 0,
            floornumbernan: 0,
            totalfloornan: 0,
          }),
        });

        const jsonResponse = await response.json();

        if (response.ok) {
          toast.success("Succesfully fetched the prediction");
          setPrediction(jsonResponse.prediction);
        } else {
          toast.error("Error during fetching the prediction");
        }
      } else {
        toast.error("Please Login to see the prediction");
        navigate(`/login?return-url=${window.location.pathname}`);
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

  const {
    _id,
    type,
    name,
    price,
    bhk,
    sqft,
    furnitureType,
    address,
    locality,
    city,
    pincode,
    addressLink,
    nearestLandmarks,
    contactNumber,
    contactEmail,
    addedBy,
    comments,
    likes,
    arrayOfImages,
    atWhichFloor,
    totalFloor,
    description,
    bathrooms,
    balconies,
    developer,
    nearestLandmarksForSearching,
  } = flat;

  console.log(flat);

  // returning UI component
  if (!loading) {
    return (
      <div className="mt-4 gap-8  p-8 flex flex-col">
        <div className="relative">
          {/* Like icon */}
          {isAuthenticate ? (
            <div className="w-[3.5rem] h-[3.5rem] bg-colorY border-2 border-[#073937] p-2 rounded-lg z-[5] absolute top-8 right-8 flex justify-center items-center">
              {likeLoading ? (
                <Spinner color="red" size="lg" className="h-full w-full" />
              ) : (
                <img
                  src={
                    likedProperty.includes(flat._id)
                      ? `/icons/red-heart.png`
                      : `/icons/heart.png`
                  }
                  className="w-full h-full"
                  onClick={toggleLike}
                  alt=""
                />
              )}
            </div>
          ) : null}

          <ImageCarousel arrayOfImages={arrayOfImages} />
        </div>

        <div className="md-down: justify-items-center  grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flat Information */}
          <div className=" cursor-pointer hover:bg-colorY2H rounded-[1rem] border border-[#F3EADC] p-6 flex items-center flex-col w-full h-auto ">
            <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
              <h3>
                <a href="" rel="noopener noreferrer" target="_blank">
                  Flat Information
                </a>
              </h3>
            </div>
            <FlatInfoCard property={"Sqft"} value={sqft} />
            <FlatInfoCard property={"Floor"} value={atWhichFloor} />
            <FlatInfoCard property={"Balconies"} value={balconies} />
            <FlatInfoCard property={"Furniture Type"} value={furnitureType} />
            <FlatInfoCard property={"Num of Baths"} value={bathrooms} />
          </div>

          {/* Description */}
          <div className="cursor-pointer hover:bg-colorY2H p-6  flex rounded-[1rem] border shadow-sm border-[#F3EADC] flex-col w-full h-auto ">
            <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
              <h3>
                <a href="" target="_blank">
                  Description
                </a>
              </h3>
            </div>
            <p className="py-2 my-2">{description}</p>
          </div>

          {/* Pricing */}
          <div className=" cursor-pointer hover:bg-colorY2H rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex flex-col items-start w-full h-auto  relative">
            <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
              <h3>
                <a href="" rel="noopener noreferrer" target="_blank">
                  ROOM BHK &amp; RENT
                </a>
              </h3>
            </div>
            <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
              <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
                {bhk} BHK Room
              </div>
              <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                <span className="">from </span>
                <span className="font-bold">&#8377; {price}</span>
              </div>
            </div>
            {prediction ? (
              <div className="mt-6 bg-[#78e7ab] mb-6 rounded-[2rem] text-black py-2 px-4 focus:outline-none focus:shadow-outline">
                {`Price Should be between ${roundToNearestThousand(
                  prediction - prediction * 0.07
                )} - ${roundToNearestThousand(
                  prediction + prediction * 0.07
                )} Rupees`}
              </div>
            ) : (
              <button
                className=""
                onClick={() => {
                  fetchPrediction(flat);
                }}
              >
                <div className=" text-[#FFFBF2] bg-colorG px-3 py-3 md-down: my-5 rounded-[1rem]">
                  <div className="text-base text-center leading-6 self-center whitespace-nowrap">
                    See Expected Price
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Nearest Landmarks */}
          <NearestLandmarks
            nearestLandmarksForSearching={nearestLandmarksForSearching}
          />

          {/* Contact Details */}
          <div className=" cursor-pointer hover:bg-colorY2H rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex items-center flex-col w-full h-auto ">
            <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
              <h3>
                <a href="" rel="noopener noreferrer" target="_blank">
                  Contact Details
                </a>
              </h3>
            </div>
            <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
              <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
                Contact Number
              </div>
              <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                <span className="font-bold">{contactNumber}</span>
              </div>
            </div>
            <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
              <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
                Mail
              </div>
              <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                <span className="font-bold">{contactEmail}</span>
              </div>
            </div>
            <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
              <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
                Address
              </div>
              <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                <span className="font-bold">{address}</span>
              </div>
            </div>
            <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
              <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
                Location URL
              </div>
              <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                <a href={addressLink} className="font-bold">
                  View On GoogleMap
                </a>
              </div>
            </div>
          </div>
          <div>MAPS</div>
          {/* Comments */}
          <div className="w-full">
            <CommentsDiv
              type="flat"
              key={_id}
              _id={_id}
              comments={comments}
              setCommentsLength={setCommentsLength}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="green" className="h-16 w-16" />
      </div>
    );
  }
}
