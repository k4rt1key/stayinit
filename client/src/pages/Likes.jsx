import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import { Text } from "../components";
import LandingPageCard from "../components/LandingPageCard";
import { Heart } from "lucide-react";
import useStore from "../zustand/likesStore";

const Likes = () => {
  const { authData } = useAuth();
  const { isAuthenticate } = authData;

  const { likes, fetchLikedProperties, isLoading, error } = useStore();

  useEffect(() => {
    if (isAuthenticate) {
      const token = localStorage.getItem("token");
      if (token) {
        fetchLikedProperties(token);
      }
    }
  }, [isAuthenticate, fetchLikedProperties]);

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (likes?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className=" p-8 bg-white flex flex-col items-center gap-4 justify-center rounded-lg">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <Text className="text-3xl font-1 text-gray-800 mb-4">
            Your Wishlist is Empty
          </Text>
          <p className="text-xl mb-8">
            You haven't liked any properties yet. Start exploring to find your
            dream home!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/listing/flat"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md transition-colors"
            >
              Explore Flats
            </Link>
            <Link
              to="/listing/hostel"
              className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-md hover:bg-green-700 transition-colors"
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
          {likes.map((like) => (
            <div key={like._id} className="relative">
              <LandingPageCard
                {...(like.hostel || like.flat)}
                type={like.hostel ? "hostel" : "flat"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Likes;
