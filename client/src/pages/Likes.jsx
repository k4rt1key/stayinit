import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/Auth";
import { Link, useLoaderData } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";

import LikedCard from "../components/LikedCard";

import { getFirstImage } from "../utils/utilityFunctions";
import { toast } from "react-toastify";

function useFetch() {
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
    }, []);

    return { likes, loading, error };
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
}

export default function likes() {
  const { likes, loading, error } = useFetch();

  const likedPropertyCards = likes.map((property) => {
    return (
      <LikedCard
        key={property._id}
        flatOrHostel={property.flat || property.hostel}
        name={property.flat ? property.flat.name : property.hostel.name}
        locality={property.flat ? property.flat.locality : property.locality}
        city={property.flat ? property.flat.city : property.hostel.city}
        type={property.flat ? "flat" : "hostel"}
      />
    );
  });

  if (!loading) {
    return (
      <div>
        <div className="p-6 text-center w-full font-Classy text-xl">
          Total {likes.length} likes
        </div>
        <div className="w-full flex flex-row flex-wrap gap-10 justify-center items-center p-6">
          {likedPropertyCards.length > 0 ? (
            likedPropertyCards
          ) : (
            <div className="p-4 flex flex-col gap-4">
              <h1 className="text-2xl">Nothing is liked...</h1>
              <Link
                to="/flats"
                className="bg-colorG rounded-[1rem] text-[#FFFBF2] text-center px-4 py-4"
              >
                Go to Flats
              </Link>
              <Link
                to="/hostels"
                className="bg-colorG rounded-[1rem] text-[#FFFBF2] text-center px-4 py-4"
              >
                Go to Hostels
              </Link>
            </div>
          )}
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
