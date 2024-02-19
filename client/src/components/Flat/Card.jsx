import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/Auth";
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
import Pricing from "../Hostel/Pricing";

function averageRating(comments) {
  let sum = 0;
  comments?.map((singleComment) => {
    sum += singleComment.rating;
  });

  return Math.round((sum / comments?.length) * 10) / 10;
}

export default function Card2({ flat }) {
  // getting authData from AuthContext
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;

  // state for liked properties
  // liked property is an array of ids of properties liked by user
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const [likeLoading, setLikeLoading] = useState(false);

  // function to get likes of user
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
          // if like is of flat then push flatid in array
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
  }, [likesLength]);

  // function to toggle likes
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
          // if unlike is successfull then remove that property from likedProperty array
          setLikedProperty(() => {
            return likedProperty.filter((property) => {
              return property !== flat._id;
            });
          });

          // decrease likesLength by 1
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
          // if like is successfull then add that property in likedProperty array
          setLikedProperty((prev) => {
            const newList = [...prev];
            newList.push(flat._id);
            return newList;
          });

          // increase likesLength by 1
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

  return (
    // <section className="cursor-pointer flex flex-col items-center py-2 px-4 my-2 min-w-[80%] md:px-[6rem]">
    //   <div className="flex flex-col w-full items-center">
    //     <div className="shadow-md bg-[#FCF5EB] border border-[#F3EADC] px-[4rem] py-4 rounded-lg max-w-[50rem]">
    //       {/* Title & Like Icon */}
    //       <div className="flex flex-row lg:justify-between justify-center gap-5 w-full">
    //         {/* Title */}
    //         <div className="flex flex-row gap-1 justify-center items-center py-4">
    //           <h1 className="leading-3 text-s md:text-xl">{flat.name}</h1>
    //           <p className="leading-3 text-xs md:text-sm">
    //             {flat.locality}, {flat.city}
    //           </p>
    //         </div>

    //         {/* Like Icon */}
    //         {isAuthenticate && (
    //           <div className="w-[2rem] flex justify-center items-center">
    //             {likeLoading ? (
    //               <Spinner color="red" size="lg" />
    //             ) : (
    //               <img
    //                 src={
    //                   likedProperty.includes(flat._id)
    //                     ? `/icons/red-heart.png`
    //                     : `/icons/heart.png`
    //                 }
    //                 onClick={toggleLike}
    //                 alt=""
    //               />
    //             )}
    //           </div>
    //         )}
    //       </div>

    //       {/* Content Layout */}
    //       <div className="w-full flex flex-col lg:flex-row gap-10 items-center lg:items-start relative">
    //         {/* Flat Image */}
    //         <div className="flex lg:items-start lg:justify-start flex-col min-w-[150px] min-h-[112px] max-h-[50.6%] max-w-[90%]">
    //           <img
    //             loading="lazy"
    //             src={getFirstImage(flat)}
    //             className="rounded-lg object-cover lg:w-[500px] lg:h-[281px] w-full h-auto"
    //             alt=""
    //           />
    //         </div>

    //         {/* Pricing */}
    //         <div className="flex items-center justify-center lg:items-end lg:justify-end flex-col w-full lg:w-[60%]">
    //           <div className="flex gap-4 flex-col w-full h-auto min-w-[200px] max-w-[90%] relative">
    //             {/* Heading */}
    //             <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
    //               <h3>
    //                 <a href="" rel="noopener noreferrer" target="_blank">
    //                   ROOM BHK &amp; RENT
    //                 </a>
    //               </h3>
    //             </div>

    //             {/* Pricing - BHK */}
    //             <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
    //               <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
    //                 {flat.bhk} BHK Room
    //               </div>
    //               <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
    //                 <span className="">from </span>
    //                 <span className="font-bold">&#8377; {flat.price}</span>
    //               </div>
    //             </div>

    //             {/* Link to Flat.jsx page */}
    //             <div className="w-full">
    //               <Link
    //                 to={`./${flat.uniqueName}`}
    //                 className="w-full"
    //                 rel="noopener noreferrer"
    //               >
    //                 <div className="bg-colorG text-[#FFFBF2] px-4 py-4 rounded-[1rem] md-down:my-5">
    //                   <div className="text-base w-full leading-6 self-center whitespace-nowrap">
    //                     See what’s available
    //                   </div>
    //                 </div>
    //               </Link>
    //             </div>
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
        <img src={flat.images[0]} alt="Property-Image" />

        {isAuthenticate ? (
          <IconButton
            size="lg"
            color={likedProperty.includes(flat._id) ? "red" : "white"}
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
              <p>{flat.name}</p>
            </Typography>
            <p>
              {flat.city}, {flat.locality}
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
            {averageRating(flat.comments)}
          </Typography>
        </div>

        {/* Card Body */}
        <Typography className="w-full">
          <div className="flex flex-col justify-between">
            <div className="flex justify-between">
              <p className="">{flat.bhk} bhk.</p>
              <p className="font-bold">{flat.price} Rs.</p>
            </div>
          </div>
        </Typography>

        {/* Link */}
        <Link to={`./${flat.uniqueName}`}>
          <div className="text-center mt-4 p-3 rounded-xl bg-colorG text-[#FFFBF2]">
            See Full Details
          </div>
        </Link>

        {/*  */}
      </CardBody>
    </Card>
  );
}
