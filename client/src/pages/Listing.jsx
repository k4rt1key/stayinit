import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useLoaderData } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import { Spinner } from "@material-tailwind/react";
import Select from "react-select";
import { toast } from "react-toastify";
import { Button, GoogleMapDiv, Img, Text } from "../components";
import LandingPageCard from "../components/LandingPageCard";

import useFetchListing from "../customHooks/useFetchListing";

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
  { label: "Below 40,000", value: "1" },
  { label: "40,000 - 80,000", value: "2" },
  { label: "80,000 - 1,20,000", value: "3" },
  { label: "1,20,000+", value: "4" },
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

const ListingPage = () => {
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [propertyArray, loading, error] = useFetchListing(searchParams);
  const { type } = useParams();

  const [likeLoading, setLikeLoading] = useState(false);
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);

  // if type is invalid then return error
  if (type != "hostel" && type != "flat") {
    throw new Error(`invalid path /listing/${type}`);
  }

  // ############# FOR MAPS STARTS
  const [propertyArrayAddresses, setPropertyArrayAddresses] = React.useState(
    []
  );

  React.useEffect(() => {
    const arr = propertyArray.map((x) => {
      return `${x.address} ${x.locality} ${x.city}`;
    });

    setPropertyArrayAddresses(arr);
  }, [propertyArray]);

  // ############# FOR MAPS ENDS

  // props ( for landing page card )
  let propertyArrayProps = propertyArray.map((p) => {
    if (type === "hostel") {
      return {
        _id: p._id,
        images: p.images,
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

        setLikeLoading,
        likedProperty,
        setLikedProperty,
        likesLength,
        setLikesLength,
      };
    } else {
      return {
        _id: p._id,
        images: p.images,
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

  useEffect(() => {
    propertyArrayProps = propertyArray.map((p) => {
      if (type === "hostel") {
        return {
          _id: p._id,
          images: p.images,
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

          setLikeLoading,
          likedProperty,
          setLikedProperty,
          likesLength,
          setLikesLength,
        };
      } else {
        return {
          _id: p._id,
          images: p.images,
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
  }, [propertyArray]);

  // %%%%%%%%% FOR FILTERS STARTS
  const [filters, setFilters] = useState(() => {
    if (type === "hostel") {
      return {
        forWhichGender: searchParams.get("forWhichGender")
          ? {
              label: genderOptions.find(
                (x) => x.value == searchParams.get("forWhichGender")
              )?.label,
              value: searchParams.get("forWhichGender"),
            }
          : null,
        priceRange: searchParams.get("priceRange")
          ? {
              label: priceOptionsForHostels.find(
                (x) => x.value == searchParams.get("priceRange")
              )?.label,
              value: searchParams.get("priceRange"),
            }
          : null,
        search: searchParams.get("search") || null,
      };
    } else {
      return {
        furnitureType: searchParams.get("furnitureType")
          ? {
              label: furnitureTypeOptions.find(
                (x) => x.value == searchParams.get("furnitureType")
              )?.label,
              value: searchParams.get("furnitureType"),
            }
          : null,
        bhk: searchParams.get("bhk")
          ? {
              label: bhkOptions.find((x) => x.value == searchParams.get("bhk"))
                ?.label,
              value: searchParams.get("bhk"),
            }
          : null,
        sqftRange: searchParams.get("sqftRange")
          ? {
              label: sqftOptions.find(
                (x) => x.value == searchParams.get("sqftRange")
              )?.label,
              value: searchParams.get("sqftRange"),
            }
          : null,
        priceRange: searchParams.get("priceRange")
          ? {
              label: priceOptions.find(
                (x) => x.value == searchParams.get("priceRange")
              )?.label,
              value: searchParams.get("priceRange"),
            }
          : null,
        search: searchParams.get("search") || null,
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
    if (filters.search) {
      newSearchParams.set("search", filters.search);
    }

    setSearchParams(newSearchParams.toString());
  }

  function submitHostelFilters(event) {
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

  let selectHostelFilters = [
    {
      options: priceOptionsForHostels,
      placeholder: "Select price",
      name: "priceRange",
      value: filters["priceRange"],
    },
    {
      options: genderOptions,
      placeholder: "Gender",
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

  // %%%%%%%%% FOR FILTERS ENDS
  const filterStyle = `py-4 placeholder: text-center focus:outline-none placeholder:text-gray-600 hover:bg-colorY2H bg-colorY2 rounded-[0.5em] border-[#D8D4CD] appearance-none border leading-5 focus:shadow-outline-blue focus:border-blue-300`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="green" className="h-16 w-16" />
      </div>
    );
  } else {
    return (
      <>
        <div className="px-[1.5rem] lg:px-[10rem] py-[2rem] flex flex-col sm:gap-10 md:gap-10 gap-[100px] items-start justify-start w-auto sm:w-full md:w-full">
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
                    className={filterStyle + " w-full md:w-[25rem]"}
                    placeholder="Search by city, locality and property name"
                    value={filters.search || ""}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        search: event.target.value,
                      });
                      console.log("after filter change", filters);
                    }}
                  />

                  {selectHostelFilters.map((selectBox) => {
                    return (
                      <Select
                        key={selectBox.name}
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            // zIndex: 10,
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
                  <button
                    className={
                      "py-4 px-8 focus:outline-none border-2 border-[#073937] appearance-none  leading-5 focus:shadow-outline-blue focus:border-blue-300 bg-colorYH rounded-[0.5rem] w-full md:w-[15rem]"
                    }
                    type="submit"
                  >
                    <span className="">
                      Search <span className="m-2"></span>🔍
                    </span>
                  </button>
                  <button
                    className={
                      "py-4 px-8 focus:outline-none border-2 border-[#073937] appearance-none leading-5 focus:shadow-outline-blue focus:border-blue-300 bg-colorYH rounded-[0.5rem] w-full md:w-[15rem]"
                    }
                    type="button"
                    onClick={clearAllFilters}
                  >
                    <span className="">
                      Clear <span className="m-2"></span>🧹
                    </span>
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
                    className={filterStyle + " w-full md:w-[25rem]"}
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
                            // zIndex: 10,
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

                  <button
                    className={
                      "py-4 px-8 focus:outline-none border-2 border-[#073937] appearance-none  leading-5 focus:shadow-outline-blue focus:border-blue-300 bg-colorYH rounded-[0.5rem] w-full md:w-[15rem]"
                    }
                    type="submit"
                  >
                    <span className="">
                      Search <span className="m-2"></span>🔍
                    </span>
                  </button>
                  <button
                    className={
                      "py-4 px-8 focus:outline-none border-2 border-[#073937] appearance-none leading-5 focus:shadow-outline-blue focus:border-blue-300 bg-colorYH rounded-[0.5rem] w-full md:w-[15rem]"
                    }
                    type="button"
                    onClick={clearAllFilters}
                  >
                    <span className="">
                      Clear <span className="m-2"></span>🧹
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* cards and map view */}
            {propertyArrayProps.length === 0 ? (
              <div className="text-2xl flex justify-center items-center w-full h-full">
                <p className="font-1 text-4xl">No {type}s Found</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
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
                    {/* <div className="flex flex-col md:flex-row gap-5 items-center justify-between w-full">
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
                  </div> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default ListingPage;
