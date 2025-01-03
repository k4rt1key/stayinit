import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, HomeIcon, Filter, DollarSign } from 'lucide-react';
import CitySearch from '../components/CitySearch';
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <div className="text-indigo-600 mb-6">{icon}</div>
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-center text-sm">{description}</p>
  </motion.div>
);

const backgrounds = [
  "/images/bg.jpg",
];

export default function Home() {
  const [propertyType, setPropertyType] = useState("flat");
  const [currentBg, setCurrentBg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (city) => {
    navigate(`/listing/${propertyType}?search=${city}`);
  };

  return (
    <div className="flex flex-col justify-center bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen flex items-center"
      >
        <AnimatePresence>
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black"
            style={{
              backgroundImage: `url('${backgrounds[currentBg]}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white"
          >
            Find Your Perfect <br />
            <span className="text-gray-200">Living Space</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl lg:text-2xl mb-12 max-w-xl mx-auto text-gray-200"
          >
            Discover your dream property in our curated selection of hostels and
            flats for rent.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className=" p-6 rounded-xl shadow-lg max-w-md mx-auto"
          >
            <CitySearch onSearch={handleSearch} setPropertyType={setPropertyType} type={propertyType}/>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentBg === index ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setCurrentBg(index)}
            />
          ))}
        </div>
      </motion.div>

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
              className="bg-indigo-900 text-white px-8 py-3 rounded-full text-base font-medium hover:bg-indigo-800 transition-colors duration-200"
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

