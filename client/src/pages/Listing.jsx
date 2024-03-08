import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import Select from "react-select";
import { toast } from "react-toastify";

import { Button, GoogleMapDiv, Img, Text } from "../components";

import LandingPageCard from "../components/LandingPageCard";

// Filters Options
const bhkOptions = [
  { label: "1 BHK", value: "1" },
  { label: "2 BHK", value: "2" },
  { label: "3 BHK", value: "3" },
  { label: "4 BHK", value: "4" },
];

const priceOptions = [
  { label: "Below 10,000", value: "1" },
  { label: "10,000 - 20,000", value: "2" },
  { label: "20,000 - 30,000", value: "3" },
  { label: "30,000+", value: "4" },
];

const priceOptionsForHostels = [
  { label: "Below 7,000", value: "1" },
  { label: "7,000 - 15,000", value: "2" },
  { label: "15,000 - 25,000", value: "3" },
  { label: "25,000+", value: "4" },
];

const furnitureTypeOptions = [
  { label: "Unfurnished", value: "unfurnished" },
  { label: "Furnished", value: "furnished" },
  { label: "Semifurnished", value: "semifurnished" },
];

const sqftOptions = [
  { label: "Below 600", value: "1" },
  { label: "600 - 1200", value: "2" },
  { label: "1200 - 2000", value: "3" },
  { label: "2000+", value: "4" },
];

const genderOptions = [
  { label: "Boys", value: "boys" },
  { label: "Girls", value: "girls" },
  { label: "Unisex", value: "both" },
];

// Fetching Flat Listing
function useFetch(searchParams) {
  try {
    const [flats, setFlats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { type } = useParams();

    async function init(searchParams) {
      setLoading(true);
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/${type}?${searchParams.toString()}`,
        requestOptions
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success === true) {
        setFlats(jsonResponse.data);
        setLoading(false);
      } else {
        // toast.error(jsonResponse.message);
        throw new Error(jsonResponse.message);
      }
    }

    useEffect(() => {
      init(searchParams);
    }, [searchParams]);

    return [flats, loading, error];
  } catch (error) {
    // toast.error(error.message);
    throw new Error(error.message);
  }
}

const ListingPage = () => {
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;

  const [likeLoading, setLikeLoading] = useState(false);
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);

  const [searchParams, setSearchParams] = useSearchParams();
  const { type } = useParams();

  const [propertyArray, loading, error] = useFetch(searchParams);

  const [propertyArrayAddresses, setPropertyArrayAddresses] = React.useState(
    []
  );

  React.useEffect(() => {
    const arr = propertyArray.map((x) => {
      return `${x.address} ${x.locality} ${x.city}`;
    });

    setPropertyArrayAddresses(arr);
  }, [propertyArray]);

  const propertyArrayProps = propertyArray.map((p) => {
    if (type === "hostel") {
      return {
        _id: p._id,
        image: p.images[0],
        city: p.city,
        locality: p.locality,
        uniqueName: p.uniqueName,
        name: p.name,
        price: p.priceAndSharing[0].price,
        sharing: p.priceAndSharing[0].sharing,
        freeLaundry: p.freeLaundry,
        wifiFacility: p.wifiFacility,
        forWhichGender: p.forWhichGender,
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
        _id: p._id,
        image: p.images[0],
        city: p.city,
        locality: p.locality,
        uniqueName: p.uniqueName,
        name: p.name,
        price: p.price,
        bhk: p.bhk,
        bathrooms: p.bathrooms,
        sqft: p.sqft,
        balconies: p.balconies,
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

  const [filters, setFilters] = useState(() => {
    if (type === "hostel") {
      return {
        forWhichGender: null,
        priceRange: null,
        search: null,
      };
    } else {
      return {
        furnitureType: null,
        bhk: null,
        sqftRange: null,
        priceRange: null,
        search: null,
      };
    }
  });

  function clearAllFilters() {
    setFilters(() => {
      if (type === "hostel") {
        return {
          forWhichGender: null,
          priceRange: null,
          search: null,
        };
      } else {
        return {
          furnitureType: null,
          bhk: null,
          sqftRange: null,
          priceRange: null,
          search: null,
        };
      }
    });

    setSearchParams("");
    // window.location.reload();
  }

  function submitFlatFilters(event) {
    const search = searchParams.get("search");
    if (search) {
      setFilters({ ...filters, search });
    }

    setSearchParams("");
    event.preventDefault();
    const newSearchParams = new URLSearchParams();

    if (filters.furnitureType) {
      newSearchParams.set("furnitureType", filters.furnitureType.value);
    }
    if (filters.bhk) {
      newSearchParams.set("bhk", filters.bhk.value);
    }
    if (filters.sqftRange) {
      newSearchParams.set("sqftRange", filters.sqftRange.value);
    }
    if (filters.priceRange) {
      newSearchParams.set("priceRange", filters.priceRange.value);
    }
    if (filters.search || searchParams.get("search")) {
      newSearchParams.set(
        "search",
        filters.search || searchParams.get("search")
      );
    }

    setSearchParams(newSearchParams.toString());
  }

  function submitHostelFilters(event) {
    const search = searchParams.get("search");
    if (search) {
      setFilters({ ...filters, search });
    }

    setSearchParams("");
    event.preventDefault();
    const newSearchParams = new URLSearchParams();

    if (filters.forWhichGender) {
      newSearchParams.set("forWhichGender", filters.forWhichGender.value);
    }
    if (filters.priceRange) {
      newSearchParams.set("priceRange", filters.priceRange.value);
    }
    if (filters.search) {
      newSearchParams.set("search", filters.search);
    }

    setSearchParams(newSearchParams.toString());
  }

  // Select Filters List
  let selectHostelFilters = [
    {
      options: priceOptionsForHostels,
      placeholder: "Select price",
      name: "priceRange",
      value: filters["priceRange"],
    },
    {
      options: genderOptions,
      placeholder: "gender",
      name: "forWhichGender",
      value: filters["forWhichGender"],
    },
  ];

  let selectFlatFilters = [
    {
      options: priceOptions,
      placeholder: "Price",
      name: "priceRange",
      value: filters["priceRange"],
    },
    {
      options: sqftOptions,
      placeholder: "Sqft",
      name: "sqftRange",
      value: filters["sqftRange"],
    },
    {
      options: furnitureTypeOptions,
      placeholder: "Furniture type",
      name: "furnitureType",
      value: filters["furnitureType"],
    },
    {
      options: bhkOptions,
      placeholder: "BHK",
      name: "bhk",
      value: filters["bhk"],
    },
  ];

  React.useEffect(() => {
    // chnage only reference but not value of selectHostelFilters and selectFlatFilters
    // because when filter changes, its changes value of selectHostelFilters and selectFlatFilters
    // but selectHostelFilters and selectFlatFilters are not re-rendered
    // because reference of selectHostelFilters and selectFlatFilters are not changed
    selectHostelFilters = [...selectHostelFilters];
    selectFlatFilters = [...selectFlatFilters];
  }, [filters]);
  const filterStyle = `py-4 px-8 focus:outline-none placeholder:text-gray-600 hover:bg-colorY2H bg-colorY2 rounded-[0.5em] border-[#D8D4CD] appearance-none border leading-5 focus:shadow-outline-blue focus:border-blue-300`;

  console.log(filters);
  return (
    <>
      <div className="px-[0.7rem] lg:px-[10rem] py-[2rem] flex flex-col sm:gap-10 md:gap-10 gap-[100px] items-start justify-start w-auto sm:w-full md:w-full">
        <div className="flex flex-col gap-10 items-center justify-center w-full">
          {/* page header and filters */}
          <div className="flex flex-col gap-6 items-center justify-center max-w-[1200px] mx-auto w-full">
            <Text
              className="text-4xl font-1 sm:text-[32px] md:text-[34px] text-gray-900 tracking-[-0.72px] w-full"
              size=""
            >
              Find Property
            </Text>

            {/* Form */}
            {type === "hostel" ? (
              <form
                className="flex flex-col md:flex-row flex-wrap gap-4 items-start justify-start w-full text-lg"
                onSubmit={submitHostelFilters}
              >
                {/* searchbar */}
                <input
                  name="search"
                  className={filterStyle + "w-full md:w-[25rem]"}
                  placeholder="Search by city, locality and property name"
                  value={filters.search || ""}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      search: event.target.value,
                    });
                  }}
                />

                {selectHostelFilters.map((selectBox) => {
                  return (
                    <Select
                      key={selectBox.name}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          zIndex: 10,
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                          border: "0 !important",
                          boxShadow: "0 !important",
                          minHeight: "auto",
                          "&:hover": {
                            border: "0 !important",
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          color: state.isSelected && "#FFFBF2",
                          backgroundColor: state.isSelected && "#191919",
                          "&:hover": {
                            backgroundColor: "#191919",
                            color: "#ffffff",
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "inherit",
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: "inherit",
                          margin: "0",
                          padding: "0",
                          // height: "0",
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          padding: "0",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          paddingTop: "0px",
                          paddingBottom: "0px",
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          padding: "0",
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          padding: "0",
                        }),
                        menuPortal: (base) => ({ ...base, zIndex: 999999 }),
                        placeholder: (base) => ({
                          ...base,
                          margin: 0,
                        }),
                      }}
                      className={filterStyle + " w-full md:w-[15rem]"}
                      isMulti={false}
                      options={selectBox.options}
                      isSearchable={false}
                      placeholder={selectBox.placeholder}
                      name={selectBox.name}
                      value={selectBox.value}
                      onChange={(event) => {
                        setFilters({
                          ...filters,
                          [selectBox.name]: event,
                        });
                      }}
                    />
                  );
                })}
                <button className={filterStyle} type="submit">
                  <span className="text-green-800">Search</span>
                </button>
                <button
                  className={filterStyle}
                  type="button"
                  onClick={clearAllFilters}
                >
                  <span className="text-red-800">Clear</span>
                </button>
              </form>
            ) : (
              <form
                className="flex flex-row flex-wrap gap-4 items-start justify-start w-full"
                onSubmit={submitFlatFilters}
              >
                {/* Searchbar */}
                <input
                  placeholder="Search by city, locality and property name"
                  className={filterStyle + "w-full md:w-[25rem]"}
                  name="search"
                  value={filters.search || ""}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      search: event.target.value,
                    });
                  }}
                />

                {selectFlatFilters.map((selectBox) => {
                  return (
                    <Select
                      key={selectBox.name}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          zIndex: 10,
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                          border: "0 !important",
                          boxShadow: "0 !important",
                          minHeight: "auto",
                          "&:hover": {
                            border: "0 !important",
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          color: state.isSelected && "#FFFBF2",
                          backgroundColor: state.isSelected && "#191919",
                          "&:hover": {
                            backgroundColor: "#191919",
                            color: "#ffffff",
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "inherit",
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: "inherit",
                          margin: "0",
                          padding: "0",
                          // height: "0",
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          padding: "0",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          paddingTop: "0px",
                          paddingBottom: "0px",
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          padding: "0",
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          padding: "0",
                        }),
                        menuPortal: (base) => ({ ...base, zIndex: 999999 }),
                        placeholder: (base) => ({
                          ...base,
                          margin: 0,
                        }),
                      }}
                      className={filterStyle + " w-full md:w-[15rem]"}
                      isMulti={false}
                      options={selectBox.options}
                      isSearchable={false}
                      placeholder={selectBox.placeholder}
                      name={selectBox.name}
                      value={selectBox.value}
                      onChange={(event) => {
                        setFilters({
                          ...filters,
                          [selectBox.name]: event,
                        });
                      }}
                    />
                  );
                })}

                <button className={filterStyle} type="submit">
                  <span className="text-green-800">Search</span>
                </button>

                <button
                  className={filterStyle}
                  type="button"
                  onClick={clearAllFilters}
                >
                  <span className="text-red-800">Clear</span>
                </button>
              </form>
            )}
          </div>

          {loading ? (
            <div className="text-2xl flex justify-center items-center w-screen h-screen">
              Loading...
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              {/* cards and map view */}
              <div className="flex flex-col gap-6 items-start justify-center max-w-[1200px]  w-full">
                {/* maps view */}
                <div className="h-[511px] border-2 border-black relative w-full">
                  <div className="h-[511px] m-auto w-full">
                    <GoogleMapDiv addresses={propertyArrayAddresses} />
                  </div>
                </div>

                {/* cards */}
                <div className="flex flex-col gap-10 items-start justify-start w-full">
                  {/* cards */}
                  <div className="flex flex-col items-start justify-start w-full">
                    <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 justify-center w-full">
                      {propertyArrayProps.map((props, index) => (
                        <div
                          className="relative"
                          key={`LandingPageCard${index}`}
                        >
                          <LandingPageCard {...props} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* page & nextpage */}
                  <div className="flex flex-col md:flex-row gap-5 items-center justify-between w-full">
                    {/* Page */}
                    <div className="flex flex-row gap-6 items-start justify-start w-auto">
                      <Button className="border border-gray-700 border-solid cursor-pointer font-semibold h-12 py-[13px] rounded-[10px] text-base text-center text-gray-900 w-12">
                        1
                      </Button>
                      <Button className="border border-bluegray-102 border-solid cursor-pointer font-semibold h-12 py-[13px] rounded-[10px] text-base text-center text-gray-900 w-12">
                        2
                      </Button>
                      <Button className="border border-bluegray-102 border-solid cursor-pointer font-semibold h-12 py-[13px] rounded-[10px] text-base text-center text-gray-900 w-12">
                        3
                      </Button>
                    </div>

                    {/* Next-Page */}
                    <Button
                      className="border border-bluegray-102 border-solid cursor-pointer flex items-center justify-center min-w-[134px] px-[17px] py-[13px] rounded-[10px]"
                      rightIcon={
                        <Img
                          className="h-4 mt-px mb-[5px] ml-1"
                          src="/images/img_arrowright_gray_900.svg"
                          alt="arrow_right"
                        />
                      }
                    >
                      <div className="font-semibold text-base text-gray-900 text-left">
                        Next Page
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListingPage;
