import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/Auth";
import { getFirstImage } from "../../utils/utilityFunctions";
import Pricing from "./Pricing";
import { toast } from "react-toastify";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Spinner,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";

function averageRating(comments) {
  let sum = 0;
  comments?.map((singleComment) => {
    sum += singleComment.rating;
  });

  return Math.round((sum / comments?.length) * 10) / 10;
}

export default function Card2({ hostel }) {
  const priceAndSharingDivArray = Array.isArray(hostel.priceAndSharing)
    ? hostel.priceAndSharing.map((x, i) => {
        return <Pricing key={i} price={x.price} sharing={x.sharing} />;
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
  }, [likesLength]);

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

  const mapsAndImageClass =
    "w-full h-full md:w-[30rem] md:h-[18rem] rounded-xl shadow-md";
  return (
    // <section className="cursor-pointer flex flex-col items-center py-2 px-4 my-2 min-w-[70%] md:px-[6rem]">
    //   <div className="flex flex-col w-full items-center">
    //     <div className="shadow-md bg-[#FCF5EB] border border-[#F3EADC] px-[4rem] py-4 rounded-lg max-w-[50rem]">
    //       {/* Title & Like Icon */}
    //       <div className="w-full max-w-[50rem] h-full">
    //         <div className="flex flex-row lg:justify-between justify-center gap-5 min-w-[200px] min-h-[90%] max-h-[50.6%] max-w-[90%]">
    //           {/* Title */}
    //           <div className="flex flex-row gap-3 items-center py-4">
    //             <h1 className="leading-3 text-sm lg:text-xl">{hostel.name}</h1>
    //             <p className="leading-3 text-xs lg:text-sm">
    //               {hostel.locality}, {hostel.city}
    //             </p>
    //           </div>
    //           {/* Like icon */}
    //           {isAuthenticate && (
    //             <div className="w-[2rem] flex justify-center items-center">
    //               {likeLoading ? (
    //                 <Spinner color="red" size="l" />
    //               ) : (
    //                 <img
    //                   src={
    //                     likedProperty.includes(hostel._id)
    //                       ? `/icons/red-heart.png`
    //                       : `/icons/heart.png`
    //                   }
    //                   onClick={toggleLike}
    //                   alt=""
    //                 />
    //               )}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //       {/* Photo And Pricing Big Div */}
    //       <div className="w-full max-w-[50rem] h-full flex lg:flex-row gap-10 items-center lg:items-start flex-col relative">
    //         {/* Hostel Image */}
    //         <div className="flex lg:items-start lg:justify-start flex-col min-w-[200px] min-h-[90%] max-h-[50.6%] max-w-[90%]">
    //           <img
    //             loading="lazy"
    //             src={getFirstImage(hostel)}
    //             className="rounded-lg object-cover lg:w-[500px] lg:h-[281px] w-full h-auto"
    //             alt=""
    //           />
    //         </div>

    //         {/* Pricing */}
    //         <div className="flex items-center justify-center lg:items-end lg:justify-end flex-col w-full lg:w-[60%]">
    //           <div className="flex justify-center flex-col gap-4 w-full h-auto min-w-[200px] max-w-[90%]">
    //             {/* Heading */}
    //             <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
    //               <h3>
    //                 <a href="" rel="noopener noreferrer" target="_blank">
    //                   ROOM Sharing &amp; RENT
    //                 </a>
    //               </h3>
    //             </div>

    //             {/* Price And Sharing Div Array */}
    //             {priceAndSharingDivArray}

    //             {/* Link to Hostel.jsx page */}
    //             <Link to={`./${hostel.uniqueName}`} rel="noopener noreferrer">
    //               <div className="lg:absolute bottom-0 right-0 bg-colorG text-[#FFFBF2] px-4 py-4 rounded-[1rem] md-down:my-5">
    //                 <div className="text-base leading-6 self-center whitespace-nowrap">
    //                   See what’s available
    //                 </div>
    //               </div>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <Card className="w-full bg-white border-2 border-[#F3EADC] bg-opacity-50 lg:flex-row lg:max-w-[60rem] max-w-[26rem] shadow-lg">
      {/* Image */}
      <CardHeader
        className="lg:w-full lg:max-w-[50%] lg:h-full"
        floated={false}
        color="blue-gray"
      >
        <img src={hostel.images[0]} alt="Property-Image" />

        {isAuthenticate ? (
          <IconButton
            size="lg"
            color={likedProperty.includes(hostel._id) ? "red" : "white"}
            variant="text"
            className="!absolute top-4 right-4 rounded-full"
          >
            <svg
              onClick={toggleLike}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </IconButton>
        ) : (
          <></>
        )}
      </CardHeader>

      {/* Card Body */}
      <CardBody className="flex flex-col justify-between lg:w-full lg:max-w-[50%]">
        {/*  */}

        {/* Heading & Star Rating */}
        <div className="mb-3 flex items-center justify-between">
          {/* City-Locality */}
          <div>
            <Typography variant="h5" color="blue-gray" className="font-medium">
              <p>{hostel.name}</p>
            </Typography>
            <p>
              {hostel.city}, {hostel.locality}
            </p>
          </div>
          {/* Rating */}
          <Typography
            color="blue-gray"
            className="flex items-center gap-1.5 font-normal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-0.5 h-5 w-5 text-yellow-700"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            {averageRating(hostel.comments)}
          </Typography>
        </div>

        {/* Card Body */}
        <Typography className="w-full">{priceAndSharingDivArray}</Typography>

        {/* Link */}
        <Link to={`./${hostel.uniqueName}`}>
          <div className="text-center mt-4 p-3 rounded-xl bg-colorG text-[#FFFBF2]">
            See Full Details
          </div>
        </Link>

        {/*  */}
      </CardBody>
    </Card>
  );
}
