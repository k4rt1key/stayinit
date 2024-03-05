import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import { toast } from "react-toastify";

import {
  Button,
  GoogleMapDiv,
  Img,
  Input,
  List,
  SelectBox,
  Text,
} from "../components";

import LandingPageCard from "../components/LandingPageCard";

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
        "http://localhost:5000/api/v1/" + type + "?" + searchParams.toString(),
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
  const [likedProperty, setLikedProperty] = useState([]);
  const [likesLength, setLikesLength] = useState(() => likedProperty.length);
  const [likeLoading, setLikeLoading] = useState(false);

  async function getLikes() {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await fetch(
        `http://localhost:5000/api/v1/likes`,
        requestOptions
      );
      const jsonResponse = await response.json();
      const data = jsonResponse.data;

      if (jsonResponse.success === true) {
        const newList = [];
        data.forEach((like) => {
          if (type === "hostel") {
            like.hostel ? newList.push(like?.hostel?._id) : null;
          } else {
            like.flat ? newList.push(like?.flat?._id) : null;
          }
        });

        setLikedProperty(newList);
      } else {
        toast.error(jsonResponse.message);
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

  React.useEffect(() => {
    if (isAuthenticate) {
      setLikeLoading(true);
      getLikes();
      setLikeLoading(false);
    }
  }, [likesLength, isAuthenticate]);

  function toggleLike(_id) {
    if (isAuthenticate) {
      if (likedProperty.includes(_id)) {
        unlike(_id);
      } else {
        like(_id);
      }
    }
  }

  async function unlike(_id) {
    try {
      if (isAuthenticate) {
        const responseOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        setLikeLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/v1/likes/${type}/${_id}`,
          responseOptions
        );
        const jsonResponse = await response.json();
        setLikeLoading(false);

        if (jsonResponse.success === true) {
          toast.success(jsonResponse.message);
          setLikedProperty(() => {
            return likedProperty.filter((property) => {
              return property !== _id;
            });
          });

          setLikesLength((prev) => {
            return prev - 1;
          });
        } else {
          toast.error(jsonResponse.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

  async function like(_id) {
    try {
      if (isAuthenticate) {
        const bodyData = {
          propertyId: _id,
          type: type,
        };

        const requestObject = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyData),
        };

        setLikeLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/v1/likes`,
          requestObject
        );
        const jsonResponse = await response.json();
        setLikeLoading(false);

        if (jsonResponse.success === true) {
          toast.success(jsonResponse.message);
          setLikedProperty((prev) => {
            const newList = [...prev];
            newList.push(_id);
            return newList;
          });

          setLikesLength((prev) => {
            return prev + 1;
          });
        } else {
          toast.error(jsonResponse.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

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
    window.location.reload();
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
      newSearchParams.set("furnitureType", filters.furnitureType);
    }
    if (filters.bhk) {
      newSearchParams.set("bhk", filters.bhk);
    }
    if (filters.sqftRange) {
      newSearchParams.set("sqftRange", filters.sqftRange);
    }
    if (filters.priceRange) {
      newSearchParams.set("priceRange", filters.priceRange);
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
      newSearchParams.set("forWhichGender", filters.forWhichGender);
    }
    if (filters.priceRange) {
      newSearchParams.set("priceRange", filters.priceRange);
    }
    if (filters.search) {
      newSearchParams.set("search", filters.search);
    }

    setSearchParams(newSearchParams.toString());
  }

  const filterStyle =
    "py-4 px-8 w-full md:w-[15rem] cursor-pointer focus:outline-none placeholder:text-[#073937] hover:bg-colorY2H focus:placeholder-[#FFFBF2] focus:bg-[#073937] focus:text-[#D8D4CD] bg-colorY2 rounded-[0.5em] border border-[#D8D4CD]";

  return (
    <>
      {loading ? (
        <div className="text-2xl flex justify-center items-center w-screen h-screen">
          Loading...
        </div>
      ) : (
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
                    placeholder="Search"
                    className={filterStyle}
                    name="search"
                    value={filters.search || ""}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        search: event.target.value,
                      });
                    }}
                  />

                  {/* price-ranges */}
                  <SelectBox
                    className={filterStyle}
                    indicator={
                      <Img
                        className="h-6 w-6"
                        src="/images/img_arrowdown_gray_700.svg"
                        alt="arrow_down"
                      />
                    }
                    isMulti={false}
                    options={priceOptionsForHostels}
                    isSearchable={true}
                    placeholder="Price"
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        priceRange: event,
                      });
                    }}
                  />
                  {/* gender options */}
                  <SelectBox
                    className={filterStyle}
                    indicator={
                      <Img
                        className="h-6 w-6"
                        src="/images/img_arrowdown_gray_700.svg"
                        alt="arrow_down"
                      />
                    }
                    isMulti={false}
                    options={genderOptions}
                    isSearchable={false}
                    placeholder="ForWhichGender"
                    name="forWhichGender"
                    value={filters.forWhichGender}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        forWhichGender: event,
                      });
                    }}
                  />

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
                    placeholder="Search"
                    className={filterStyle}
                    name="search"
                    value={filters.search || ""}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        search: event.target.value,
                      });
                    }}
                  />

                  {/* Priceranges */}
                  <SelectBox
                    className={filterStyle}
                    indicator={
                      <Img
                        className="h-6 w-6"
                        src="/images/img_arrowdown_gray_700.svg"
                        alt="arrow_down"
                      />
                    }
                    isMulti={false}
                    options={priceOptions}
                    isSearchable={false}
                    placeholder="Price"
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        priceRange: event,
                      });
                    }}
                  />

                  {/* Sqft */}
                  <SelectBox
                    className={filterStyle}
                    indicator={
                      <Img
                        className="h-6 w-6"
                        src="/images/img_arrowdown_gray_700.svg"
                        alt="arrow_down"
                      />
                    }
                    isMulti={false}
                    options={sqftOptions}
                    isSearchable={false}
                    placeholder="Sqft"
                    name="sqftRange"
                    value={filters.sqftRange}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        sqftRange: event,
                      });
                    }}
                  />

                  {/* Furniture Options */}
                  <SelectBox
                    className={filterStyle}
                    indicator={
                      <Img
                        className="h-6 w-6"
                        src="/images/img_arrowdown_gray_700.svg"
                        alt="arrow_down"
                      />
                    }
                    isMulti={false}
                    options={furnitureTypeOptions}
                    isSearchable={false}
                    placeholder="Furniture type"
                    name="furnitureType"
                    value={filters.furnitureType}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        furnitureType: event,
                      });
                    }}
                  />

                  {/* Bhk Options */}
                  <SelectBox
                    className={filterStyle}
                    indicator={
                      <Img
                        className="h-6 w-6"
                        src="/images/img_arrowdown_gray_700.svg"
                        alt="arrow_down"
                      />
                    }
                    isMulti={false}
                    options={bhkOptions}
                    isSearchable={false}
                    placeholder="BHK"
                    name="bhk"
                    value={filters.bhk}
                    onChange={(event) => {
                      setFilters({
                        ...filters,
                        bhk: event,
                      });
                    }}
                  />

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

            {/* cards and map view */}
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
                          <button
                            onClick={() => toggleLike(props._id)}
                            className="flex flex-col justify-center absolute top-2 right-2 border-2 p-2 border-black bg-gray-200 items-center text-black font-semibold rounded-lg"
                          >
                            <img
                              className="h-8 w-8"
                              src={
                                likedProperty.includes(props._id)
                                  ? "/images/liked.png"
                                  : "/images/like.png"
                              }
                              alt=""
                            />
                          </button>
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
          </div>
        </div>
      )}
    </>
  );
};

export default ListingPage;
