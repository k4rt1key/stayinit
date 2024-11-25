import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Maximize2 } from "lucide-react";
import { useAuth } from "../../contexts/Auth";
import { motion } from "framer-motion";
import useStore from "../../zustand/likesStore";

const LandingPageCard = ({
  _id,
  className,
  type,
  images,
  name,
  uniqueName,
  city,
  locality,
  sharing,
  bhk,
  sqft,
  price,
  priceAndSharing,
}) => {
  const { authData } = useAuth();
  const { isAuthenticate } = authData;
  const navigate = useNavigate();

  const {
    likes,
    isPropertyLiked,
    toggleLike,
    isLoading,
    updatePropertyLikeStatus,
  } = useStore();

  const backgroundImage =
    images?.length > 0 ? images[0] : "/images/property.png";

  if (priceAndSharing) {
    price = priceAndSharing[0]?.price;
    sharing = priceAndSharing[0]?.sharing;
  }

  // const isLiked = isPropertyLiked(type, _id);
  const isLiked = likes?.some(
    (like) =>
      (type === "hostel" && like.hostel?._id === _id) ||
      (type === "flat" && like.flat?._id === _id)
  );

  const handleLikeToggle = async () => {
    if (!isAuthenticate) {
      navigate("/login", { state: { returnUrl: window.location.pathname } });
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      await toggleLike(type, _id, token);
      updatePropertyLikeStatus(type, _id, !isLiked);
    }
  };

  return (
    <motion.div
      className={`relative h-64 rounded-lg overflow-hidden shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/listing/${type}/${uniqueName}`);
        }}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-1 text-white mb-1">{name}</h2>
            <div className="flex items-center text-white/80">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm font-semibold">
                {city?.charAt(0).toUpperCase() + city?.slice(1)},{" "}
                {locality?.charAt(0).toUpperCase() + locality?.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={handleLikeToggle}
              className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "text-red-500 fill-current" : "text-white"
                }`}
              />
            </motion.button>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to={`/listing/${type}/${uniqueName}`}
                className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="View details"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-2xl font-bold text-white">{price} ₹</span>
            {type === "flat" && (
              <span className="text-sm text-white/80 ml-2">{sqft} sqft</span>
            )}
          </div>
          <span className="text-sm font-medium text-white bg-black/50 px-3 py-2 rounded-full">
            {type === "hostel" ? `${sharing} Sharing` : `${bhk} BHK`}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPageCard;
