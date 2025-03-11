import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Bed,
  Bath,
  Maximize,
  Wifi,
  Dumbbell,
  Wind,
  Gamepad,
  Shirt,
  Shield,
  Droplet,
  Camera,
  MapPin,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import getFlat from "../BackendUtils/getFlat";
import getHostel from "../BackendUtils/getHostel";
import { extractCoordinatesFromUrl } from "../utils/UtilityFunctions";
import PropertyGallery from "../components/PropertyGallary";
import useAuth from "../contexts/Auth";
import AIPricePredictor from "../components/AIPricePredictor";

const PropertyPage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [property, setProperty] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { type: propertyType, propertyname: propertyName } = useParams();

  const addressCordinates = extractCoordinatesFromUrl(property?.addressLink);
  const lat = addressCordinates?.split(",")[0];
  const long = addressCordinates?.split(",")[1];

  const { isAuthenticate } = useAuth();
  
  
  useEffect(() => {
    async function fetchProperty() {
      if (propertyType === "flat") {
        const response = await getFlat(propertyName);
        if (response.success) {
          setProperty(response.data);
        }
      } else {
        const response = await getHostel(propertyName);
        if (response.success) {
          setProperty(response.data);
        }
      }
    }
    fetchProperty();
  }, [propertyType, propertyName]);

  const renderPricing = () => {
    if (property?.type === "flat") {
      return (
        <div>
          <p className="text-2xl font-bold text-indigo-600">
            ₹{property.price.toLocaleString()}
          </p>
          <AIPricePredictor property={property} />
        </div>
      );
    } else if (property?.type === "hostel") {
      return (
        <ul className="space-y-2">
          {property.priceAndSharing?.map((item, index) => (
            <li key={index} className="text-lg">
              <span className="">{item.sharing} Sharing:</span>{" "}
              <span className="text-indigo-600 font-semibold">
                ₹{item.price.toLocaleString()}
              </span>{" "}
              / Year
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p className="text-gray-500 italic text-sm">
        Pricing information not available
      </p>
    );
  };

  const renderDetails = () => {
    if (property?.type === "flat") {
      return (
        <div className="grid grid-cols-2 gap-4 text-md">
          {property.bhk && (
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Bed className="w-5 h-5 mr-2 text-indigo-600" />
              <div>
                <p className="text-gray-500">BHK</p>
                <p className="font-semibold text-md">{property.bhk}</p>
              </div>
            </div>
          )}

          {property.sqft && (
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Maximize className="w-5 h-5 mr-2 text-indigo-600" />
              <div>
                <p className="text-gray-500">Area</p>
                <p className="font-semibold">{property.sqft} sq.ft.</p>
              </div>
            </div>
          )}

          {property.bathrooms && (
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <div>
                <Bath className="w-5 h-5 mr-2 text-indigo-600" />
                <div>
                  <p className="text-gray-500">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>
            </div>
          )}

          {property.atWhichFloor && (
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
              <div>
                <p className="text-gray-500">at </p>
                <p className="font-semibold">
                  {property.atWhichFloor} {
                    property.atWhichFloor == 1 ? ("th") :
                   
                    property.atWhichFloor == 2 ? "nd": 
                     property.atWhichFloor == 3 ? "rd" : "th"
                   } floor
                </p>
              </div>
            </div>
          )}
        </div>
      );
    } else if (property?.type === "hostel") {
      return (
        <div className="grid grid-cols-2 gap-4">
          {property.availableRooms && (
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
              <div>
                <p className="text-gray-500">For</p>
                <p className="font-semibold capitalize">
                  {property.forWhichGender}
                </p>
              </div>
            </div>
          )}

          {property.liftFacility && (
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <ChevronUp className="w-5 h-5 mr-2 text-indigo-600" />
              <div>
                <p className="text-gray-500">Lift</p>
                <p className="font-semibold">Available</p>
              </div>
            </div>
          )}
        </div>
      );
    }
    return <p className="text-gray-500">No details available</p>;
  };

  const renderAmenities = () => {
    const amenities =
      property?.type === "hostel"
        ? [
            { icon: Wifi, label: "Wi-Fi", condition: property?.wifiFacility },
            { icon: Dumbbell, label: "Gym", condition: property?.gymFacility },
            { icon: Wind, label: "AC", condition: property?.acFacility },
            {
              icon: Gamepad,
              label: "Gaming Room",
              condition: property?.gamingRoom,
            },
            {
              icon: Shirt,
              label: "Free Laundry",
              condition: property?.freeLaundry,
            },
            {
              icon: Shield,
              label: "Security Guard",
              condition: property?.securityGuard,
            },
            {
              icon: Droplet,
              label: "Filtered Water",
              condition: property?.filterWater,
            },
            { icon: Camera, label: "CCTV", condition: property?.cctv },
          ]
        : [];

    const availableAmenities = amenities.filter((amenity) => amenity.condition);

    if (availableAmenities.length === 0) {
      return (
        <p className="text-gray-500">No amenities information available</p>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {availableAmenities.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 p-2 rounded-lg"
          >
            <amenity.icon className="w-4 h-4 mr-2 text-indigo-600" />
            <span className="font-medium text-md">{amenity.label}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!property) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="bg-white  md:w-[70rem] text-gray-800 px-4 py-6">
        <PropertyGallery images={property.images} />
        <div className="mt-4">
          <h1 className="text-2xl font-1 font-bold mb-2">
            {property.name} -{" "}
            <span className="text-xl">
              {property.locality},{property.city}
            </span>
          </h1>
          {property.isFeatured && (
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
              Featured
            </span>
          )}

          <div className="my-6  bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-1 font-semibold mb-3">
              {property.type === "flat" ? "Rent" : "Pricing"}
            </h2>
            {renderPricing()}
          </div>

          <div className="mb-8">
            <div className="flex border-b overflow-x-auto">
              {["details", "amenities", "contact"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-1 whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-4 text-md">
              {activeTab === "details" && renderDetails()}
              {activeTab === "amenities" && renderAmenities()}
              {/* {activeTab === "contact" && isAuthenticate ? (
                <div className="space-y-3">
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                    <span>{property.contactNumber}</span>
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                    <span>{property.contactEmail}</span>
                  </p>
                  <p className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-indigo-600 mt-1" />
                    <span>
                      {property.address}, {property.locality}, {property.city},{" "}
                      {property.pincode}
                    </span>
                  </p>
                </div>
              ) : <>
                <p>Please Login to see contact details</p>
              </>} */}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-xl font-1 font-semibold mb-3">Description</h2>
              <div className="relative">
                <p
                  className={`text-lg text-gray-700 leading-relaxed ${
                    !showFullDescription && "line-clamp-3"
                  }`}
                >
                  {!property.description && (
                    <div className="text-lg">No description</div>
                  )}
                  {property.description}
                </p>
                {property.description?.length > 200 && (
                  <button
                    className="text-indigo-600 font-medium mt-2 flex items-center text-sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? (
                      <>
                        See Less
                        <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        See More
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-1 font-semibold mb-3">Location</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/search?q=${property.name}, at ${property.locality} ${property.city}}&key=AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4`}
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  // loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  allow="geolocation"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
