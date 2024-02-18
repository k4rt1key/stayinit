import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useSearchParams } from "react-router-dom";
import { Dialog } from "@material-tailwind/react";

export default function Cards({ flats }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    furnitureType: null,
    bhk: null,
    minSqft: null,
    maxSqft: null,
    minPrice: null,
    maxPrice: null,
  });

  function clearAllFilters() {
    setFilters({
      furnitureType: null,
      bhk: null,
      minSqft: null,
      maxSqft: null,
      minPrice: null,
      maxPrice: null,
    });

    setSearchParams("");
  }

  function submitFilters(event) {
    setSearchParams("");
    event.preventDefault();

    const searchParams = new URLSearchParams();
    if (filters.furnitureType)
      searchParams.set("furnitureType", filters.furnitureType);
    if (filters.bhk) searchParams.set("bhk", filters.bhk);
    if (filters.minSqft) searchParams.set("minSqft", filters.minSqft);
    if (filters.maxSqft) searchParams.set("maxSqft", filters.maxSqft);
    if (filters.minPrice) searchParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) searchParams.set("maxPrice", filters.maxPrice);
    if (searchParams.get("search"))
      searchParams.set("search", searchParams.get("search"));

    setSearchParams(searchParams.toString());

    handleOpen();
  }

  const length = flats.length;
  const flatCards = flats.map((flat) => {
    return <Card key={flat._id} flat={flat} />;
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const filterStyle =
    "py-2 px-4 sm: w-[10rem] focus:outline-none placeholder:text-[#073937] hover:bg-colorY2H focus:placeholder-[#FFFBF2] focus:bg-[#073937] focus:text-[#D8D4CD] bg-colorY2 rounded-[3rem] border border-[#D8D4CD]";
  const filterStyleForFurniture =
    "py-2 px-4 w-[10rem] md:w-[10rem] focus:outline-none placeholder:text-[#073937] bg-colorY2 rounded-[3rem] border border-[#D8D4CD]";
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-center items-center">
        <div className="flex flex-col justify-center gap-4 items-center">
          <div className="flex flex-row gap-2 justify-start items-center">
            {/* dialog */}
            <button
              onClick={handleOpen}
              className="px-4 py-2 bg-white border-2 border-[#F3EADC] bg-opacity-50 rounded-xl text-[#073937] "
            >
              Filters
            </button>
            <Dialog
              size="xs"
              open={open}
              handler={handleOpen}
              className="bg-transparent shadow-none"
            >
              <div className="flex justify-center bg-colorY items-center mb-2 px-[2rem] md:px-[6rem] rounded-[1rem]">
                <div className="flex flex-wrap justify-center items-center gap-2 my-3 py-[0.5rem] w-full">
                  {/* BHK Filters */}
                  <select
                    className={
                      filterStyleForFurniture +
                      " cursor-pointer text-[#073937] bg-colorY2"
                    }
                    name="bhk"
                    id="bhk"
                    onChange={(event) =>
                      setFilters({ ...filters, bhk: event.target.value })
                    }
                    value={filters.bhk}
                  >
                    <option value="">BHK</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>

                  {/* Furniture Type Filters */}
                  <select
                    className={
                      filterStyleForFurniture +
                      " cursor-pointer text-[#073937] bg-colorY2"
                    }
                    name="furnitureType"
                    id="furniture"
                    onChange={(event) =>
                      setFilters({
                        ...filters,
                        furnitureType: event.target.value,
                      })
                    }
                    value={filters.furnitureType}
                  >
                    <option value="">Furniture Type</option>
                    <option value="furnished">Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semifurnished">SemiFurnished</option>
                  </select>

                  {/* Pricing and Sqft Filters */}
                  <input
                    className={filterStyle}
                    type="number"
                    placeholder="Min Price"
                    name="minPrice"
                    id="minPrice"
                    onChange={(event) =>
                      setFilters({ ...filters, minPrice: event.target.value })
                    }
                    value={filters.minPrice}
                  />
                  <input
                    className={filterStyle}
                    type="number"
                    placeholder="Max Price"
                    name="maxPrice"
                    id="maxPrice"
                    onChange={(event) =>
                      setFilters({ ...filters, maxPrice: event.target.value })
                    }
                    value={filters.maxPrice}
                  />
                  <input
                    className={filterStyle}
                    type="number"
                    placeholder="Min Sqft"
                    name="minSqft"
                    id="minSqft"
                    onChange={(event) =>
                      setFilters({ ...filters, minSqft: event.target.value })
                    }
                    value={filters.minSqft}
                  />
                  <input
                    className={filterStyle}
                    type="number"
                    placeholder="Max Sqft"
                    name="maxSqft"
                    id="maxSqft"
                    onChange={(event) =>
                      setFilters({ ...filters, maxSqft: event.target.value })
                    }
                    value={filters.maxSqft}
                  />

                  {/* Clear All filters */}
                  <button
                    className={filterStyle + " text-red-400"}
                    onClick={clearAllFilters}
                  >
                    <u>Clear</u>
                  </button>
                  <button
                    className={filterStyle + " text-red-400"}
                    onClick={submitFilters}
                  >
                    <u>Submit</u>
                  </button>
                </div>
              </div>
            </Dialog>
            <p className="px-4 py-2 bg-white border-2 border-[#F3EADC] bg-opacity-50 rounded-xl text-[#073937] ">
              Showing {length} {length === 1 ? "property" : "properties"}{" "}
            </p>
          </div>
          {flatCards}
          {flatCards}
          {flatCards}
          {flatCards}
          {flatCards}
        </div>
      </div>
    </div>
  );
}
