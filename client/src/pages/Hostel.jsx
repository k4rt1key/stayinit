import React, { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
  useLoaderData,
  useRevalidator,
} from "react-router-dom";

import { Spinner } from "@material-tailwind/react";
import { useAuth } from "../contexts/Auth";
import { nanoid } from "nanoid";

import Pricing from "../components/Hostel/Pricing";
import AminitesText from "../components/Hostel/AminitiesText";
import ImageCarousel from "../components/ImageCarousel";
import CommentsDiv from "../components/CommentsDiv";
import NearestLandmarks from "../components/NearestLandmarks";
import { toast } from "react-toastify";

function useFetch(commentsLength) {
  try {
    const params = useParams();
    const { hostelname } = params;

    const [hostel, setHostel] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function init(hostelname) {
      setLoading(true);
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const response = await fetch(
        `http://localhost:5000/api/v1/hostel/${hostelname}`,
        requestOptions
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success === true) {
        setHostel(jsonResponse.data);
        setLoading(false);
      } else {
        setError(jsonResponse.message);
        toast.error(jsonResponse.message);
        throw new Error(jsonResponse.message);
      }
    }

    useEffect(() => {
      init(hostelname);
    }, [params, commentsLength]);

    return { hostel, loading, error };
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
}

export default function HostelInfo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [commentsLength, setCommentsLength] = useState(0);
  const { hostel, loading, error } = useFetch(commentsLength);

  const {
    _id,
    name,
    priceAndSharing,
    forWhichGender,
    addressLink,
    address,
    locality,
    city,
    pincode,
    contactNumber,
    developer,
    contactEmail,
    addedBy,
    nearestLandmarksForSearching,
    comments,
    likes,
    images,
    description,
    liftFacility,
    wifiFacility,
    gymFacility,
    acFacility,
    gamingRoom,
    freeLaundry,
    securityGuard,
    filterWater,
    cctv,
    cleaning,
  } = hostel;

  // Creating Aminities Div
  const aminitesArr = [];

  if (acFacility === true) {
    aminitesArr.push(<AminitesText url={"ac.png"} name={"Air Conditioner"} />);
  }
  if (liftFacility === true) {
    aminitesArr.push(<AminitesText url={"lift.png"} name={"Lift Avilable"} />);
  }
  if (wifiFacility === true) {
    aminitesArr.push(<AminitesText url={"wifi.png"} name={"Free Wifi"} />);
  }
  if (gymFacility === true) {
    aminitesArr.push(<AminitesText url={"gym.png"} name={"Gym Facility"} />);
  }
  if (freeLaundry === true) {
    aminitesArr.push(
      <AminitesText url={"laundry.png"} name={"Free Laundry"} />
    );
  }
  if (cctv === true) {
    aminitesArr.push(<AminitesText url={"cctv.png"} name={"CCTV"} />);
  }
  if (cleaning === true) {
    aminitesArr.push(
      <AminitesText url={"cleaning.png"} name={"Room Cleaning"} />
    );
  }
  if (securityGuard === true) {
    aminitesArr.push(
      <AminitesText url={"security.png"} name={"Security Guard"} />
    );
  }
  if (filterWater === true) {
    aminitesArr.push(<AminitesText url={"water.png"} name={"Water Filter"} />);
  }

  // Creating Pricing And Sharing Div
  const priceAndSharingDivArray = Array.isArray(priceAndSharing)
    ? priceAndSharing.map((x) => {
        return <Pricing key={nanoid()} price={x.price} sharing={x.sharing} />;
      })
    : [];

  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;

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
        `http://localhost:5000/api/v1/likes`,
        requestOptions
      );
      const jsonResponse = await response.json();
      const data = jsonResponse.data;

      if (jsonResponse.success === true) {
        const newList = [];
        data.forEach((like) => {
          like.hostel ? newList.push(like.hostel._id) : null;
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
      if (likedProperty.includes(hostel._id)) {
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
          `http://localhost:5000/api/v1/likes/hostel/${hostel._id}`,
          responseOptions
        );
        const jsonResponse = await response.json();
        setLikeLoading(false);

        if (jsonResponse.success === true) {
          toast.success(jsonResponse.message);
          setLikedProperty(() => {
            return likedProperty.filter((property) => {
              return property !== hostel._id;
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
          propertyId: hostel._id,
          type: "hostel",
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
            newList.push(hostel._id);
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

  const hostelInfoList = [
    {
      name: "Developer",
      value: developer,
    },
    {
      name: "ForWhichGender",
      value: forWhichGender,
    },
  ];

  const hostelContactAndAdress = [
    {
      name: "Address",
      value: `${address}`,
    },
    {
      name: "Locality",
      value: `${locality}, ${city} (${pincode})`,
    },
    {
      name: "Contact Number",
      value: contactNumber,
    },
    {
      name: "Contact Email",
      value: contactEmail,
    },
    {
      name: "Address Link",
      value: "AddressLink",
      url: addressLink,
    },
  ];

  if (!loading) {
    return (
      <div className="gap-8 p-6 flex flex-col">
        {/* Title */}
        <div className="flex bg-[#FCF5EB] rounded-xl border border-[#F3EADC] p-4 flex-row lg:justify-between justify-center gap-2 w-full">
          {/* Title Content */}
          <div className="w-[90%] flex justify-start items-center flex-row gap-3">
            <h1 className="leading-3 text-xl lg:text-3xl">{hostel.name}</h1>
            <p className="leading-3 text-sm lg:text-lg flex justify-center items-center">
              {hostel.locality}, {hostel.city}
            </p>
          </div>

          {/* Like icon */}
          {isAuthenticate && (
            <div className="w-[2rem] flex justify-center items-center">
              {likeLoading ? (
                <Spinner color="red" size="l" />
              ) : (
                <img
                  src={
                    likedProperty.includes(hostel._id)
                      ? `/icons/red-heart.png`
                      : `/icons/heart.png`
                  }
                  onClick={toggleLike}
                  alt=""
                />
              )}
            </div>
          )}
        </div>

        {/* Grid Layout */}
        <div className="md-down:justify-items-center grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Images */}
          <div className="relative">
            <ImageCarousel images={images} />
          </div>

          {/* Maps */}
          <div className="w-full h-auto">
            <iframe
              className="w-full h-full"
              loading="lazy"
              allowfullscrehover:bg-colorY2Hen
              referrerpolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4
                &q=${name}+${locality}+${city}+WA`}
            ></iframe>
          </div>

          {/* Amenities Array */}
          <div className="bg-colorY hover:bg-[#FCF5EB] cursor-pointer rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex flex-col items-start w-full h-auto relative gap-4 no-scrollbar overflow-x-hidden">
            <div className="flex flex-row flex-wrap gap-2 my-3 py-[0.5rem] px-10 w-full">
              {aminitesArr}
            </div>
          </div>

          {/* Pricing */}
          <div className="cursor-pointer hover:bg-[#FCF5EB] rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex flex-col gap-4 items-start justify-evenly w-full h-auto relative">
            {/* Price and Sharing Details */}
            <div className="flex-col items-start self-stretch flex w-full justify-between gap-5 mt-4">
              <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                <h3>
                  <a href="" rel="noopener noreferrer" target="_blank">
                    ROOM BHK &amp; RENT
                  </a>
                </h3>
              </div>
              {priceAndSharingDivArray}
            </div>

            {/* Hostel Information */}
            <div className="flex-col items-start self-stretch flex w-full justify-between gap-5 mt-4">
              <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                <h3>
                  <a href="" rel="noopener noreferrer" target="_blank">
                    Hostel Info
                  </a>
                </h3>
              </div>
              {hostelInfoList.map((x) => (
                <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
                  <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
                    {x.name}
                  </div>
                  <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                    <a
                      href={x.url ? x.url : ""}
                      target="_blank"
                      className="font-bold"
                    >
                      {x.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="cursor-pointer hover:bg-[#FCF5EB] rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex items-center flex-col w-full h-auto ">
            {hostelContactAndAdress.map((x) => (
              <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
                <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
                  {x.name}
                </div>
                <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                  <a
                    href={x.url ? x.url : ""}
                    target="_blank"
                    className="font-bold"
                  >
                    {x.value}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="cursor-pointer hover:bg-[#FCF5EB] p-6 flex rounded-[1rem] border shadow-sm border-[#F3EADC] flex-col w-full h-auto ">
            <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
              <h3>
                <a href="" target="_blank">
                  Description
                </a>
              </h3>
            </div>
            <p className="py-2 my-2">{description}</p>
          </div>

          {/* Nearest Landmarks */}
          <NearestLandmarks
            nearestLandmarksForSearching={nearestLandmarksForSearching}
          />

          {/* Comments */}
          <div className="w-full hover:bg-[#FCF5EB]">
            <CommentsDiv
              key={_id}
              type="hostel"
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
