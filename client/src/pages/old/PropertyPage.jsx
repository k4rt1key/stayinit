import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";
import { Button, Text } from "../../components";
import ImageGallery from "../../components/ImageGallary";
import NearestLandmarksMap from "../../components/NearestLandmarksMaps";
import { toast } from "react-toastify";
import { roundToNearestThousand } from "../../utils/UtilityFunctions";
import useFetchProperty from "../../customHooks/useFetchProperty";
import useFetchPrediction from "../../customHooks/useFetchPrediction";
import SuggestedProperties from "../../components/SuggestedProperties";
import PropertyInfoBoxes from "../../components/PropertyInfoBoxes";
import { Heart, Phone, Mail, MapPin } from "lucide-react";
import { extractCoordinatesFromUrl } from "../../utils/UtilityFunctions";

export default function PropertyPage() {
  const { authData } = useAuth();
  const { isAuthenticate } = authData;
  const [property, loading, error] = useFetchProperty();
  const type = property?.type || useParams().type;
  const navigate = useNavigate();

  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [prediction, predictionLoading, predictionError] =
    useFetchPrediction(property);

  useEffect(() => {
    if (isAuthenticate) {
      setLikeLoading(true);
      getLikes();
      setLikeLoading(false);
    }
  }, [likesLength, isAuthenticate]);

  async function getLikes() {
    // ... (keep existing getLikes function)
  }

  function toggleLike(_id) {
    // ... (keep existing toggleLike function)
  }

  async function unlike(_id) {
    // ... (keep existing unlike function)
  }

  async function like(_id) {
    // ... (keep existing like function)
  }

  const PropertyInfo =
    type === "hostel"
      ? [
          { name: "For", value: property.forWhichGender, icon: "🧑🏻‍🤝‍🧑🏻" },
          { name: "Lift", value: property.liftFacility, icon: "🛗" },
          { name: "Free Wifi", value: property.wifiFacility, icon: "🛜" },
          { name: "Gym", value: property.gymFacility, icon: "🏋🏻" },
          { name: "AC Rooms", value: property.acFacility, icon: "❄️" },
          { name: "Gaming Room", value: property.gamingRoom, icon: "🎮" },
          { name: "Laundry", value: property.freeLaundry, icon: "🧺" },
          { name: "Security Guard", value: property.securityGuard, icon: "👮🏻" },
          { name: "Filter Water", value: property.filterWater, icon: "🚰" },
          { name: "CCTV", value: property.cctv, icon: "📹" },
          { name: "Cleaning", value: property.cleaning, icon: "🧹" },
        ]
      : [
          { name: "Sqft", value: property.sqft, icon: "📏" },
          { name: "Furniture", value: property.furnitureType, icon: "🪑" },
          { name: "Floor", value: property.atWhichFloor, icon: "🏢" },
          { name: "Total Floor", value: property.totalFloor, icon: "🏢" },
          { name: "Bathrooms", value: property.bathrooms, icon: "🚽" },
          { name: "Balconies", value: property.balconies, icon: "🏞️" },
        ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading size={"medium"} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        {/* Image Gallery */}
        <div className="w-full">
          <ImageGallery
            imageClassName="h-[60vh] w-full object-cover"
            images={property?.images}
          />
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Address */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {property.address}, {property.locality}, {property.city},{" "}
                {property.pincode}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => toggleLike(property._id)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={
                    likedProperty.includes(property._id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500"
                  }
                />
                Wishlist
              </Button>
              {property.type === "flat" && (
                <Button
                  onClick={() => {
                    if (!isAuthenticate) {
                      // navigate("/login", {
                      //   state: { returnUrl: window.location.pathname },
                      // });
                    }
                    setShowPrediction(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showPrediction
                    ? `Expected Price: ${roundToNearestThousand(
                        prediction * 0.95
                      )} - ${roundToNearestThousand(prediction * 1.05)} ₹`
                    : "See Expected Price"}
                </Button>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-gray-100 p-6 rounded-lg">
              {type === "flat" ? (
                <div className="text-center">
                  <span className="text-3xl font-bold">₹{property.price}</span>
                  <span className="text-gray-600 ml-2">
                    For {property.bhk} BHK
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {property?.priceAndSharing?.map((x, index) => (
                    <div key={index} className="text-center">
                      <span className="text-2xl font-bold">₹{x.price}</span>
                      <span className="text-gray-600 block">
                        For {x.sharing} Sharing
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property Highlights */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {type.charAt(0).toUpperCase() + type.slice(1)} Highlights
              </h2>
              <PropertyInfoBoxes PropertyInfo={PropertyInfo} />
            </div>

            {/* Map */}
            <div>
              <NearestLandmarksMap property={property} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Agent Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Agent Information</h2>
              <p className="text-lg mb-4">{property?.addedBy?.username}</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{property.contactNumber}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{property.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Properties */}
        <SuggestedProperties property={property} />
      </div>
    </div>
  );
}
