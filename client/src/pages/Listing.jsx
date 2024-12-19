import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import LandingPageCard from "../components/LandingPageCard";
import useFetchListing from "../customHooks/useFetchListing";
import { ChevronLeft, ChevronRight, Sliders } from "lucide-react";
import useStore from "../zustand/likesStore";
import useAuth from "../contexts/Auth";
import Loading from "../components/Loading";
import CitySearch from "../components/CitySearch";

const ListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [propertyArray, loading, error] = useFetchListing(searchParams);
  const { type } = useParams(); // hostel or flat
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticate } = useAuth();
  const navigate = useNavigate();
  const [likesLength, setLikesLength] = useState(0);

  const {
    likes,
    fetchLikedProperties,
    isPropertyLiked,
    toggleLike,
    isLoading,
  } = useStore();

  useEffect(() => {
    if (isAuthenticate) {
      const token = localStorage.getItem("token");
      if (token) {
        fetchLikedProperties(token);
      }
    }
  }, [isAuthenticate, fetchLikedProperties]);

  // Filters state
  const [filters, setFilters] = useState({
    priceRange: [],
    bhk: [],
    sqftRange: [],
    furnitureType: [],
    forWhichGender: [],
  });

  // Filter options based on type (hostel or flat)
  const filterOptions = {
    priceRange:
      type === "hostel"
        ? [
            { label: "Below 40,000", value: "1" },
            { label: "40,000 - 80,000", value: "2" },
            { label: "80,000 - 1,20,000", value: "3" },
            { label: "1,20,000+", value: "4" },
          ]
        : [
            { label: "Below 10,000", value: "1" },
            { label: "10,000 - 20,000", value: "2" },
            { label: "20,000 - 30,000", value: "3" },
            { label: "30,000+", value: "4" },
          ],
    bhk: [
      { label: "1 BHK", value: "1" },
      { label: "2 BHK", value: "2" },
      { label: "3 BHK", value: "3" },
      { label: "4 BHK", value: "4" },
    ],
    sqftRange: [
      { label: "Below 600", value: "1" },
      { label: "600 - 1200", value: "2" },
      { label: "1200 - 2000", value: "3" },
      { label: "2000+", value: "4" },
    ],
    furnitureType: [
      { label: "Unfurnished", value: "unfurnished" },
      { label: "Furnished", value: "furnished" },
      { label: "Semifurnished", value: "semifurnished" },
    ],
    forWhichGender: [
      { label: "Boys", value: "boys" },
      { label: "Girls", value: "girls" },
      { label: "Unisex", value: "both" },
    ],
  };

  // Handle filter change
  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value],
    }));
  };

  // Filtering logic
  const itemsPerPage = 8;
  const startIndex = (page - 1) * itemsPerPage;

  const filteredProperties = useMemo(() => {
    return propertyArray
      .filter((property) => {
        // Price range filter
        if (type == "flat") {
          if (filters?.priceRange?.length > 0) {
            let priceMatches = filters?.priceRange?.some((x) => {
              if (x == 1) return property.price < 10000;
              if (x == 2)
                return property.price >= 10000 && property.price < 20000;
              if (x == 3)
                return property.price >= 20000 && property.price < 30000;
              if (x == 4) return property.price >= 30000;
            });
            if (!priceMatches) return false;
          }
        }

        if (type == "hostel") {
          if (filters?.priceRange?.length > 0) {
            let priceMatches = filters?.priceRange?.some((x) => {
              if (x == 1) return property.priceAndSharing[0]?.price < 40000;
              if (x == 2) {
                return (
                  property.priceAndSharing[0]?.price >= 40000 &&
                  property.priceAndSharing[0]?.price < 80000
                );
              }
              if (x == 3) {
                return (
                  property.priceAndSharing[0]?.price >= 80000 &&
                  property.priceAndSharing[0]?.price < 120000
                );
              }
              if (x == 4) {
                return property.priceAndSharing[0]?.price >= 120000;
              }
            });

            if (!priceMatches) return false;
          }
        }

        // BHK filter (only for flats)
        if (type === "flat" && filters.bhk.length > 0) {
          const bhkMatches = filters?.bhk?.includes(property?.bhk?.toString());
          if (!bhkMatches) return false;
        }

        // Sqft filter (only for flats)
        if (type === "flat" && filters?.sqftRange?.length > 0) {
          let sqftMatches = filters?.sqftRange?.some((sqft) => {
            if (sqft == 1) return property.sqft < 600;
            if (sqft == 2) return property.sqft >= 600 && property.sqft < 1200;
            if (sqft == 3) return property.sqft >= 1200 && property.sqft < 2000;
            if (sqft == 4) return property.sqft >= 2000;
          });
          if (!sqftMatches) return false;
        }

        // Furniture Type filter (only for flats)
        if (type === "flat" && filters?.furnitureType?.length > 0) {
          const furnitureMatches = filters?.furnitureType?.includes(
            property?.furnitureType?.toLowerCase()
          );
          if (!furnitureMatches) return false;
        }

        // Gender filter (only for hostels)
        if (type === "hostel" && filters.forWhichGender.length > 0) {
          const genderMatches = filters.forWhichGender.includes(
            property.forWhichGender.toLowerCase()
          );
          if (!genderMatches) return false;
        }

        return true;
      })
      .slice(startIndex, startIndex + itemsPerPage);
  }, [propertyArray, likesLength, page, filters, type]);

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-600">
          Failed to load properties. Please try again.
        </p>
      </div>
    );
  }

  const handleSearch = (city) => {
    navigate(`/listing/${type}?search=${city}`);
  };


  if (loading) {
    return <Loading size={"medium"} />;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-10 w-64 h-screen transition-transform duration-300 ease-in-out bg-white shadow-lg lg:shadow-none overflow-y-auto`}
      >
        <div className="p-6 mb-20">
          <h2 className="text-2xl font-1 mb-6 text-gray-800">Filters</h2>
          <div className="mb-6">
            <CitySearch onSearch={handleSearch} type={type} value={searchParams.toString().replace("search=","")}/>
          </div>
          {Object.entries(filterOptions).map(([category, options]) => {
            // Only render relevant filters based on type
            if (
              (type === "flat" &&
                ["priceRange", "bhk", "sqftRange", "furnitureType"].includes(
                  category
                )) ||
              (type === "hostel" &&
                ["priceRange", "forWhichGender"].includes(category))
            ) {
              return (
                <div key={category} className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-700 capitalize">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  {options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        checked={filters[category].includes(option.value)}
                        onChange={() =>
                          handleFilterChange(category, option.value)
                        }
                      />
                      <span className="ml-2 text-gray-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              );
            }
            return null;
          })}
        </div>
      </aside>

      {/* Listing content */}
      <main className="flex-1">
        <div className="flex justify-between items-center p-6 w-[97%] rounded-2xl bg-gray-100 ml-4">
          <h1 className="text-lg md:text-3xl text-center font-1">
            {type.charAt(0).toUpperCase() + type.slice(1)} Listings{" "}
            {type.charAt(0).toLowerCase() + type.slice(1) === "flat"
              ? "for Rent"
              : ""}{" "}
          </h1>
          <button
            className="lg:hidden bg-blue-600 text-white p-2 rounded-full"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Sliders size={24} />
          </button>
        </div>

        <section className="p-6 min-h-screen grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
              <LandingPageCard
                key={index}
                _id={property._id}
                className={""}
                type={property.type}
                images={property.images}
                name={property.name}
                uniqueName={property.uniqueName}
                city={property.city}
                locality={property.locality}
                sharing={property.sharing}
                bhk={property.bhk}
                sqft={property.sqft}
                price={property.price}
                priceAndSharing={property?.priceAndSharing}
                setLikesLength={setLikesLength}
              />
            ))
          ) : (
            <p>No properties found matching your filters.</p>
          )}
        </section>

        {/* Pagination section moved outside */}
        <div className="flex justify-center items-center space-x-4 my-8">
          <button
            className="px-2 py-2 bg-gray-300 rounded-full"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft />
          </button>
          <span>{page}</span>
          <button
            className="px-2 py-2 bg-gray-300 rounded-full"
            onClick={() => setPage((prev) => prev + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ListingPage;
