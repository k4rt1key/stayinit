import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Home as HomeIcon, Filter, DollarSign } from "lucide-react";
import CitySearch from '../components/CitySearch'
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="flex flex-col items-center p-8 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
    whileHover={{ y: -5 }}
  >
    <div className="text-black mb-6">{icon}</div>
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-center text-sm">{description}</p>
  </motion.div>
);

export default function Home() {
  // const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("flat");
  const navigate = useNavigate();

  const handleSearch = (city) => {
    navigate(`/listing/${propertyType}?search=${city}`);
  };

  return (
    <div className="flex flex-col justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gray-400 py-24 px-6 lg:px-32"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-1 mb-6 leading-tight text-white">
            Find Your Perfect <br />
            <span className="text-gray-200">Living Space</span>
          </h1>
          <p className="text-xl lg:text-2xl mb-12 max-w-xl mx-auto text-gray-200">
            Discover your dream property in our curated selection of hostels and
            flats for rent.
          </p>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-gray-400/40 p-6 rounded-xl shadow-md max-w-md mx-auto"
          >
            <div className="flex md:flex gap-4 mb-6">
              <button
                onClick={() => setPropertyType("flat")}
                className={`px-8 py-3 rounded-full transition-colors duration-200 font-medium flex-1 ${
                  propertyType === "flat"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-black "
                }`}
              >
                Flat
              </button>
              <button
                onClick={() => setPropertyType("hostel")}
                className={`px-8 py-2 rounded-full transition-colors duration-200 font-medium flex-1 ${
                  propertyType === "hostel"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900 "
                }`}
              >
                Hostel
              </button>
            </div>
              <CitySearch onSearch={handleSearch} type={propertyType}/>
          </motion.div>
        </div>
      </motion.div>

      {/* Feature Section */}
      <div className="py-24 px-6 lg:px-32 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold font-1 mb-12 text-center text-gray-800"
          >
            Our Features
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<HomeIcon className="w-12 h-12" />}
              title="List Your Property"
              description="Easily add and manage your property listings with our intuitive platform."
            />
            <FeatureCard
              icon={<Filter className="w-12 h-12" />}
              title="Advanced Search"
              description="Use our powerful filters to find your perfect home that meets all your criteria."
            />
            <FeatureCard
              icon={<DollarSign className="w-12 h-12" />}
              title="Featured Listings"
              description="Boost your property's visibility with our premium featured listings option."
            />
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-100 py-24 px-6 lg:px-32"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-1 font-bold mb-6 text-black">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-700 mb-12">
            Join our community of property owners and seekers today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => {
                navigate("/dashboard/add-flat");
              }}
              className="bg-indigo-900 text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              List Property
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/flatlist");
              }}
              className="bg-white text-black px-8 py-3 rounded-full text-base font-medium border border-black hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Listings
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
