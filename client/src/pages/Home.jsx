"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, HomeIcon, Filter, DollarSign } from 'lucide-react'
import CitySearch from "../components/CitySearch"
import { useNavigate } from "react-router-dom"

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <div className="text-indigo-600 mb-4 sm:mb-6">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 text-center">{title}</h3>
    <p className="text-gray-600 text-center text-xs sm:text-sm">{description}</p>
  </motion.div>
)

const backgrounds = ["/images/bg.jpg"]

export default function Home() {
  const [propertyType, setPropertyType] = useState("flat")
  const [currentBg, setCurrentBg] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (city) => {
    navigate(`/listing/${propertyType}?search=${city}`)
  }

  return (
    <div className="flex flex-col justify-center bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[600px] sm:h-screen flex items-center"
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
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 w-full max-w-6xl mx-auto text-center px-4 sm:px-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white"
          >
            Find Your Perfect <br />
            <span className="text-gray-200">Living Space</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-xl mx-auto text-gray-200"
          >
            Discover your dream property in our curated selection of hostels and flats for rent.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="p-4 sm:p-6 rounded-xl shadow-lg max-w-md mx-auto"
          >
            <CitySearch onSearch={handleSearch} setPropertyType={setPropertyType} type={propertyType} />
          </motion.div>
        </div>
        <div className="absolute bottom-4 sm:bottom-10 left-0 right-0 flex justify-center space-x-2">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${
                currentBg === index ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setCurrentBg(index)}
            />
          ))}
        </div>
      </motion.div>

      <div className="py-12 sm:py-24 px-4 sm:px-6 lg:px-32 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl font-bold font-1 mb-8 sm:mb-12 text-center text-gray-800"
          >
            Our Features
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <FeatureCard
              icon={<HomeIcon className="w-8 h-8 sm:w-12 sm:h-12" />}
              title="List Your Property"
              description="Easily add and manage your property listings with our intuitive platform."
            />
            <FeatureCard
              icon={<Filter className="w-8 h-8 sm:w-12 sm:h-12" />}
              title="Advanced Search"
              description="Use our powerful filters to find your perfect home that meets all your criteria."
            />
            <FeatureCard
              icon={<DollarSign className="w-8 h-8 sm:w-12 sm:h-12" />}
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
        className="bg-gray-100 py-12 sm:py-24 px-4 sm:px-6 lg:px-32"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-1 font-bold mb-4 sm:mb-6 text-black">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-8 sm:mb-12">
            Join our community of property owners and seekers today!
          </p>
          <div className="flex flex-col gap-4">
            
          </div>
        </div>
      </motion.div>
    </div>
  )
}

