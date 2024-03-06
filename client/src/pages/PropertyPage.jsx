import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";

import { Button, GoogleMapDiv, Img, Input, List, Text } from "../components";
import LandingPageCard from "../components/LandingPageCard";
import ImageGallary from "../components/ImageGallary";
import { useAuth } from "../contexts/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { roundToNearestThousand } from "../utils/utilityFunctions";

function useFetch() {
  const [property, setProperty] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { type, propertyname } = useParams();
  async function init(type, propertyname) {
    if (type == "undefined" || propertyname == "undefined") {
      setError("Invalid URL");
    }
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(
      `http://localhost:5000/api/v1/${type}/${propertyname}`,
      requestOptions
    );
    const jsonResponse = await response.json();

    if (jsonResponse.success === true) {
      setProperty(jsonResponse.data);
      setLoading(false);
    } else {
      toast.error(jsonResponse.message);
      // throw new Error(jsonResponse.message);
    }
  }

  useEffect(() => {
    init(type, propertyname);
  }, [type, propertyname]);

  return [property, loading, error];
}

export default function PropertyPage() {
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;
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
        `http://localhost:5000/api/v1/likes`,
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

  const landingPageCardPropList = [{}, {}, {}, {}, {}];

  const { type } = useParams();
  const [property, loading, error] = useFetch();
  if (error !== "") {
    throw new Error(error);
  }

  let PropertyInfo = [];
  if (type === "hostel") {
    PropertyInfo = [
      {
        name: "forWhichGender",
        value: property.forWhichGender,
      },
      {
        name: "liftFacility",
        value: property.liftFacility,
      },
      {
        name: "wifiFacility",
        value: property.wifiFacility,
      },
      {
        name: "gymFacility",
        value: property.gymFacility,
      },
      {
        name: "acFacility",
        value: property.acFacility,
      },
      {
        name: "gamingRoom",
        value: property.gamingRoom,
      },
      {
        name: "freeLaundry",
        value: property.freeLaundry,
      },
      {
        name: "securityGuard",
        value: property.securityGuard,
      },
      {
        name: "filterWater",
        value: property.filterWater,
      },
      {
        name: "cctv",
        value: property.cctv,
      },
      {
        name: "cleaning",
        value: property.cleaning,
      },
    ];
  }

  if (type === "flat") {
    PropertyInfo = [
      { name: "sqft", value: property.sqft },
      { name: "furnitureType", value: property.furnitureType },
      { name: "atWhichFloor", value: property.atWhichFloor },
      { name: "totalFloor", value: property.totalFloor },
      { name: "bathrooms", value: property.bathrooms },
      { name: "balconies", value: property.balconies },
    ];
  }

  const [mapQuery, setMapQuery] = React.useState(
    `${property.name}, ${property.locality}, ${property.city}`
  );
  const [mapQueryNumber, setMapQueryNumber] = React.useState(1);

  // output prediction price state which we will be show to users
  const [prediction, setPrediction] = React.useState("");
  const predictionText = `Price Should be between ${roundToNearestThousand(
    prediction * 0.95
  )} - ${roundToNearestThousand(prediction * 1.05)} Rupees`;

  // property data in form

  const [propertyData, setPropertyData] = useState({
    property_sqft: property.sqft,
    property_bhk: property.bhk,
    property_city: property.city,
    property_locality: property.locality,
    is_furnished: property.furnitureType,
    property_project: property.name,
    num_of_baths: property.bathrooms,
    bachelors_or_family: "bachelors",
    floornumber: property.atWhichFloor,
    totalfloor: property.totalFloor,

    property_pricenan: 0,
    property_bhknan: 0,
    property_sqftnan: 0,
    num_of_bathsnan: 0,
    floornumbernan: 0,
    totalfloornan: 0,
  });
  React.useEffect(() => {
    setPropertyData({
      property_sqft: property.sqft,
      property_bhk: property.bhk,
      property_city: property.city,
      property_locality: property.locality,
      is_furnished: property.furnitureType,
      property_project: property.name,
      num_of_baths: property.bathrooms,
      bachelors_or_family: "bachelors",
      floornumber: property.atWhichFloor,
      totalfloor: property.totalFloor,

      property_pricenan: 0,
      property_bhknan: 0,
      property_sqftnan: 0,
      num_of_bathsnan: 0,
      floornumbernan: 0,
      totalfloornan: 0,
    });
  }, [property]);

  // making request to server to predict price for user inputed property data
  async function fetchPrediction() {
    try {
      // convert form data string to lowercase string for accurate prediction in ml model
      const p_proj = propertyData.property_project
        .toLowerCase()
        .replace(" ", "_");
      const p_city = propertyData.property_city.toLowerCase();
      const p_loc = propertyData.property_locality.toLowerCase();
      const p_isfun = propertyData.is_furnished.toLowerCase();

      // if user is authenticated... then make api call
      if (authData.isAuthenticate) {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            property_sqft: propertyData.property_sqft,
            property_bhk: propertyData.property_bhk,
            property_city: p_city,
            property_locality: p_loc,
            is_furnished: p_isfun,
            property_project: p_proj,
            num_of_baths: propertyData.num_of_baths,
            bachelors_or_family: "bachelors",
            floornumber: propertyData.floornumber,
            totalfloor: propertyData.totalfloor || propertyData.atWhichFloor,
            property_pricenan: 0,
            property_bhknan: 0,
            property_sqftnan: 0,
            num_of_bathsnan: 0,
            floornumbernan: 0,
            totalfloornan: 0,
          }),
        };
        const response = await fetch("http://localhost:7000/", options);
        const responseJson = await response.json();
        const data = responseJson.prediction;

        if (response.ok) {
          toast.success("Successfully fetched prediction");
          setPrediction(data);
        } else {
          toast.error(responseJson.message);
        }
      }
      // if user is not autheticated... then redirect to "login"
      else {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

  return (
    <>
      <div className="px-[0.7rem] lg:px-[10rem] py-[0.5rem] flex flex-col gap-10 items-start justify-start w-full">
        {/* part - 1 properties's info */}
        <div className="flex flex-col gap-10 items-start justify-start w-full">
          {/* images */}
          <div className="w-full relative">
            <ImageGallary images={property?.images} />
          </div>
          {/* property's info cards */}
          <div className="flex xl:flex-row flex-col gap-6 items-start justify-center w-full">
            {/* property's info cards */}
            <div className="flex flex-1 flex-col gap-6 items-start justify-start w-full">
              <div className="bg-white border border-bluegray-100 border-solid flex flex-col items-start justify-start p-4 lg:p-10 sm:px-5 rounded-[10px] w-full">
                <div className="flex flex-col gap-11 items-start justify-start w-full">
                  <div className="flex flex-col gap-6 items-start justify-start w-full">
                    {/* name and address */}
                    <div className="flex flex-col gap-4 items-start justify-start w-full">
                      <Text className="text-xl lg:text-3xl font-semibold leading-[135.00%]">
                        {property.name}{" "}
                        {type === "flat" ? `- by ${property.developer}` : ""}
                      </Text>
                      <Text className="text-gray-900 text-xl tracking-[-0.40px] w-full">
                        {property.address}, {property.locality}, {property.city}
                        , {property.pincode}
                      </Text>
                    </div>
                    {/* wishlist button */}
                    <button
                      onClick={() => toggleLike(property._id)}
                      className="flex flex-row gap-4 w-full justify-center border-2 p-1 border-black bg-gray-200 items-center text-black font-semibold rounded-lg"
                    >
                      <img
                        className="h-8 w-8 lg:h-12 lg:w-12"
                        src={
                          likedProperty.includes(property._id)
                            ? "/images/liked.png"
                            : "/images/like.png"
                        }
                        alt=""
                      />
                      {"Add to Wishlist"}
                    </button>
                    <button
                      className="flex flex-row gap-4 w-full justify-center
                    border-2 p-2 border-black bg-gray-200 items-center
                    text-black font-semibold rounded-lg"
                      onClick={fetchPrediction}
                    >
                      {prediction == "" ? "See Expected Price" : predictionText}
                    </button>
                    {/* pricing */}
                    <div className="flex flex-row flex-wrap gap-4 items-start justify-start w-full">
                      {type === "flat" ? (
                        <div className="bg-white border-2 border-black border-solid flex flex-1 flex-col items-center justify-center sm:px-5 px-6 py-[7px] rounded-[10px] w-full">
                          <div className="flex flex-col gap-1 items-start justify-start w-full">
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
                                <div className="flex flex-col gap-1 items-start justify-start w-full">
                                  <Text className="text-2xl md:text-[22px] text-gray-900 font-semibold sm:text-xl tracking-[-0.48px] w-full">
                                    ₹{x.price}
                                  </Text>
                                  <Text className="text-gray-600 text-md w-full">
                                    For {x.bhk} BHK
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
                  {/* nearest landmarks */}
                  <div className="flex flex-col gap-6 items-start justify-start w-full">
                    <div className="flex flex-col gap-6 items-start justify-start w-full">
                      <Text className="text-lg lg:text-xl font-semibold leading-[135.00%]">
                        Local Information
                      </Text>
                      {/* 4 buttons */}
                      <div className="gap-3 grid grid-cols-1 md:grid-cols-4 items-center justify-center  w-full">
                        <Button
                          onClick={() => {
                            setMapQueryNumber(1);
                            setMapQuery(
                              `${property.name}, ${property.locality}, ${property.city}`
                            );
                          }}
                          className={`${
                            mapQueryNumber === 1
                              ? "bg-gray-900 text-white "
                              : "text-gray-900"
                          } border border-bluegray-100 border-solid cursor-pointer flex-1 font-semibold py-[11px] rounded-[10px] text-base text-center  w-full`}
                        >
                          Map
                        </Button>
                        <Button
                          onClick={() => {
                            setMapQueryNumber(2);
                            setMapQuery(
                              `cafes around 10km of ${property.name},${property.locality}`
                            );
                          }}
                          className={`${
                            mapQueryNumber === 2
                              ? "bg-gray-900 text-white "
                              : "text-gray-900"
                          } border border-bluegray-100 border-solid cursor-pointer flex-1 font-semibold py-[11px] rounded-[10px] text-base text-center  w-full`}
                        >
                          Cafes
                        </Button>
                        <Button
                          onClick={() => {
                            setMapQueryNumber(3);
                            setMapQuery(
                              `public transportations near ${property.name},${property.locality},${property.city}`
                            );
                          }}
                          className={`${
                            mapQueryNumber === 3
                              ? "bg-gray-900 text-white "
                              : "text-gray-900"
                          } border border-bluegray-100 border-solid cursor-pointer flex-1 font-semibold py-[11px] rounded-[10px] text-base text-center  w-full`}
                        >
                          Bus Transportation
                        </Button>
                        <Button
                          onClick={() => {
                            setMapQueryNumber(4);
                            setMapQuery(
                              `${property.name},${property.locality},${property.city} to ${property.city} railway station`
                            );
                          }}
                          className={`${
                            mapQueryNumber === 4
                              ? "bg-gray-900 text-white "
                              : "text-gray-900"
                          } border border-bluegray-100 border-solid cursor-pointer flex-1 font-semibold py-[11px] rounded-[10px] text-base text-center  w-full`}
                        >
                          Railway-Station
                        </Button>
                      </div>
                    </div>
                    <div className="h-[400px] border-2 border-black relative w-full">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4&q=${mapQuery}`}
                        className="h-full w-full"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
              {/* highlights */}
              <div className="bg-white border border-bluegray-100 border-solid flex flex-col gap-6 items-start justify-start p-4 lg:p-10 rounded-[10px] w-full">
                <Text className="text-xl md:text-2xl w-full font-semibold">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Highlights
                </Text>
                <div className="flex lg:flex-row flex-col gap-6 items-start justify-start w-full">
                  {/* lists of highlights */}
                  <List
                    className="gap-10 justify-between w-full"
                    orientation="horizontal"
                  >
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-[2rem] gap-y-2 items-between justify-between w-full">
                      {PropertyInfo.map((x) => {
                        return (
                          <div
                            key={x.name + Math.random()}
                            className="flex flex-row gap-4 items-center justify-between w-full"
                          >
                            <Text className="text-gray-800 text-md lg:text-xl">
                              {x.name}
                            </Text>
                            <Text className="text-md lg:text-xl font-semibold text-gray-900">
                              {x.value === true
                                ? "Yes"
                                : x.value !== false
                                ? x.value
                                : "No"}
                            </Text>
                          </div>
                        );
                      })}
                    </div>
                  </List>
                </div>
              </div>
              {/* agent */}
              <div className="bg-white border border-bluegray-100 border-solid flex flex-col items-start justify-start p-4 lg:p-10 rounded-[10px] w-full">
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
            {/* get in contact */}
            <div className="flex flex-col gap-10 items-start justify-start w-full xl:w-[336px]">
              <div className="flex flex-col gap-6 items-start justify-start w-full">
                <Text className="sm:text-2xl font-semibold md:text-[26px] text-[28px] text-gray-900 tracking-[-0.56px] w-full">
                  Request for Visit
                </Text>
                <div className="flex flex-col gap-3 h-[440px] md:h-auto items-start justify-start w-full">
                  <Input
                    name="textfieldlarge"
                    placeholder="Full Name"
                    className="focus:border-transparent outline-none font-semibold p-0 placeholder:text-gray-600 sm:pr-5 text-gray-600 text-left text-lg w-full"
                    wrapClassName="bg-white border border-bluegray-100 border-solid flex pl-4 pr-[35px] py-[17px] rounded-[10px] w-full"
                    type="text"
                    prefix={
                      <Img
                        className="mt-auto mb-px h-6 mr-3.5"
                        src="/images/img_user.svg"
                        alt="user"
                      />
                    }
                  ></Input>
                  <Input
                    name="textfieldlarge_One"
                    placeholder="Email Address"
                    className="focus:border-transparent outline-none font-semibold p-0 placeholder:text-gray-600 sm:pr-5 text-gray-600 text-left text-lg w-full"
                    wrapClassName="bg-white border border-bluegray-100 border-solid flex pl-4 pr-[35px] py-[17px] rounded-[10px] w-full"
                    type="email"
                    prefix={
                      <Img
                        className="mt-auto mb-px h-6 mr-3.5"
                        src="/images/img_mail_gray_600_24x24.svg"
                        alt="mail"
                      />
                    }
                  ></Input>
                  <Input
                    name="textfieldlarge_Two"
                    placeholder="Phone Number"
                    className="focus:border-transparent outline-none font-semibold p-0 placeholder:text-gray-600 sm:pr-5 text-gray-600 text-left text-lg w-full"
                    wrapClassName="bg-white border border-bluegray-100 border-solid flex pl-4 pr-[35px] py-[17px] rounded-[10px] w-full"
                    type="number"
                    prefix={
                      <Img
                        className="mt-auto mb-px h-6 mr-3.5"
                        src="/images/img_call.svg"
                        alt="call"
                      />
                    }
                  ></Input>

                  <div className="bg-white border border-bluegray-100 border-solid flex flex-col h-[152px] md:h-auto items-start justify-start px-[19px] py-3.5 rounded-[10px] w-full">
                    <Text
                      className="text-gray-600 text-lg w-auto"
                      size="txtManropeSemiBold18Gray600"
                    >
                      Message
                    </Text>
                  </div>
                </div>
              </div>
              <Button className="bg-gray-900 cursor-pointer font-semibold py-[17px] rounded-[10px] text-base text-center text-white w-full">
                Send Request
              </Button>
            </div>
          </div>
        </div>
        {/*  part - 2 suggested properties */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col md:gap-10 gap-[60px] md:h-auto items-start justify-start max-w-[1200px] mx-auto w-full">
            {/* featured property - title  */}
            <div className="flex flex-col gap-6 items-start justify-start w-full">
              <div className="flex flex-col gap-10 items-center justify-between w-full">
                <Text className="text-2xl md:text-4xl sm:text-[32px] md:text-[34px] text-gray-900 tracking-[-0.72px] w-auto">
                  Featured Properties
                </Text>
                <Button
                  className="common-pointer bg-transparent cursor-pointer flex items-center justify-center min-w-[124px]"
                  onClick={() => navigate("/listing")}
                  rightIcon={
                    <Img
                      className="h-6 mb-[3px] ml-2"
                      src="/images/img_arrowright.svg"
                      alt="arrow_right"
                    />
                  }
                >
                  <div className="font-bold text-left text-lg text-orange-A700">
                    Explore All
                  </div>
                </Button>
              </div>
            </div>

            {/* cards */}
            <div className="flex flex-col items-start justify-start w-full">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
