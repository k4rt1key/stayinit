import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { Button, Text } from "../components";
import LandingPageCard from "../components/LandingPageCard";
import useFetchLikes from "../customHooks/useFetchLikes";
import { Heart } from "lucide-react";

export default function Likes() {
  const navigate = useNavigate();
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;

  const [likeLoading, setLikeLoading] = useState(false);
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const [likes, loading, error] = useFetchLikes(likesLength);

  const likeArrayProps = likes.map((l) => {
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

  useEffect(() => {
    if (!isAuthenticate) {
      navigate("/login", { state: { returnUrl: window.location.pathname } });
    }
  }, [isAuthenticate, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="blue" className="h-16 w-16" />
      </div>
    );
  }

  if (likeArrayProps.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <Text className="text-3xl font-bold text-gray-800 mb-4">
            Your Wishlist is Empty
          </Text>
          <p className="text-gray-600 mb-8">
            You haven't liked any properties yet. Start exploring to find your
            dream home!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/listing/flat"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Explore Flats
            </Link>
            <Link
              to="/listing/hostel"
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
            >
              Discover Hostels
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 p-6 bg-gray-100 rounded-xl">
          <h1 className="text-2xl font-1 text-gray-900">
            Your Liked Properties
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {likeArrayProps.map((props, index) => (
            <div key={`LikedProperty${index}`} className="relative">
              <div className="absolute top-4 right-4 z-10"></div>
              <LandingPageCard {...props} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
