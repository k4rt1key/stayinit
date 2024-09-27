import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

// import of utility functions
import { toast } from "react-toastify";
import { roundToNearestThousand } from "../utils/UtilityFunctions";
import useFetchPrediction from "../customHooks/useFetchPrediction";

const filterStyle =
  "py-2 px-4 w-full focus:outline-none placeholder:text-[#073937] hover: focus:placeholder-[#FFFBF2] focus:bg-[#073937] focus:text-[#D8D4CD]  rounded-[3rem] border border-[#D8D4CD]";

export default function Prediction() {
  const [prediction, loading, error] = useFetchPrediction();

  const [propertyData, setPropertyData] = useState({
    property_sqft: 1000,
    property_bhk: 3,
    property_city: "ahmedabad",
    property_locality: "bopal",
    is_furnished: "furnished",
    property_project: "demo",
    num_of_baths: 2,
    bachelors_or_family: "bachelors/family",
    floornumber: 7,
    totalfloor: 7,
    property_pricenan: 0,
    property_bhknan: 0,
    property_sqftnan: 0,
    num_of_bathsnan: 0,
    floornumbernan: 0,
    totalfloornan: 0,
  });

  // handling property form data chnaging by updating "propertyData" state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({
      ...propertyData,
      [name]: value,
    });
  };

  return (
    <div className="lg:px-[10rem] mt-6 sm-down: px-12 mx-auto">
      <form className="">
        <div className="mb-4 ">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="property_sqft"
          >
            Property Sqft
          </label>
          <input
            className={filterStyle}
            type="number"
            name="property_sqft"
            value={propertyData.property_sqft}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="property_bhk"
          >
            Property BHK
          </label>
          <input
            className={filterStyle}
            type="number"
            name="property_bhk"
            value={propertyData.property_bhk}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="property_city"
          >
            Property City
          </label>
          <input
            className={filterStyle}
            type="text"
            name="property_city"
            value={propertyData.property_city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="property_locality"
          >
            Property Locality
          </label>
          <input
            className={filterStyle}
            type="text"
            name="property_locality"
            value={propertyData.property_locality}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="is_furnished"
          >
            Is Furnished
          </label>
          <select
            className={filterStyle}
            name="is_furnished"
            value={propertyData.is_furnished}
            onChange={handleChange}
            required
          >
            <option value="furnished">Furnished</option>
            <option value="unfurnished">Not Furnished</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="property_project"
          >
            Property Project
          </label>
          <input
            className={filterStyle}
            type="text"
            name="property_project"
            value={propertyData.property_project}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="num_of_baths"
          >
            Number of Baths
          </label>
          <input
            className={filterStyle}
            type="number"
            name="num_of_baths"
            value={propertyData.num_of_baths}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="bachelors_or_family"
          >
            Suitable for
          </label>
          <select
            className={filterStyle}
            name="bachelors_or_family"
            value={propertyData.bachelors_or_family}
            onChange={handleChange}
            required
          >
            <option value="bachelors/family">Bachelors/Family</option>
            <option value="family">Family</option>
            <option value="bachelors">Bachelors</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="floornumber"
          >
            Floor Number
          </label>
          <input
            className={filterStyle}
            type="number"
            name="floornumber"
            value={propertyData.floornumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="totalfloor"
          >
            Total Floor
          </label>
          <input
            className={filterStyle}
            type="number"
            name="totalfloor"
            value={propertyData.totalfloor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={fetchPrediction}
            className="bg-[#073937] mb-6 cursor-pointer rounded-[2rem] text-white py-2 px-4 focus:outline-none focus:shadow-outline"
          >
            Let's see prediction
          </button>
        </div>
      </form>
      <div className="mb-6 ">
        {prediction ? (
          <div className="bg-[#78e7ab] mb-6 rounded-[2rem] text-black py-2 px-4 focus:outline-none focus:shadow-outline">
            {`Price Should be between ${roundToNearestThousand(
              prediction - prediction * 0.07
            )} - ${roundToNearestThousand(
              prediction + prediction * 0.07
            )} Rupees`}
          </div>
        ) : (
          <div className="text-green-500 text-text-xs"></div>
        )}
      </div>
    </div>
  );
}
