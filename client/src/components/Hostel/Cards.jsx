import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Dialog } from "@material-tailwind/react";

import Card from "./Card";

export default function Cards({ hostels }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    forWhichGender: null,
    minPrice: null,
    maxPrice: null,
  });

  function clearAllFilters() {
    setFilters({
      forWhichGender: null,
      minPrice: null,
      maxPrice: null,
    });

    setSearchParams("");
  }

  function submitFilters(event) {
    setSearchParams("");
    event.preventDefault();

    const searchParams = new URLSearchParams();
    if (filters.forWhichGender)
      searchParams.set("forWhichGender", filters.forWhichGender);
    if (filters.minPrice) searchParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) searchParams.set("maxPrice", filters.maxPrice);
    if (searchParams.get("search"))
      searchParams.set("search", searchParams.get("search"));

    setSearchParams(searchParams.toString());

    handleOpen();
  }

  const length = hostels.length;
  const hostelsCard = hostels.map((hostel) => {
    return <Card key={hostel._id} hostel={hostel} />;
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const filterStyle =
    "py-2 px-4 sm: w-[10rem] focus:outline-none placeholder:text-[#073937] hover:bg-colorY2H focus:placeholder-[#FFFBF2] focus:bg-[#073937] focus:text-[#D8D4CD] bg-colorY2 rounded-[3rem] border border-[#D8D4CD]";
  const filterStyleForGender =
    "py-2 px-4 w-[10rem] sm:w-[10rem] focus:outline-none placeholder:text-[#073937] bg-colorY2 rounded-[3rem] border border-[#D8D4CD]";
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

            {/* length of properies */}
            <p className="px-4 py-2 bg-white border-2 border-[#F3EADC] bg-opacity-50 rounded-xl text-[#073937] ">
              Showing {length} {length === 1 ? "property" : "properties"}{" "}
            </p>

            <Dialog
              size="xs"
              open={open}
              handler={handleOpen}
              className="bg-transparent shadow-none"
            >
              <div className="flex justify-center bg-colorY items-center mb-2 px-[2rem] md:px-[6rem] rounded-[1rem]">
                <div className="flex flex-wrap justify-center items-center gap-2 my-3 py-[0.5rem] w-full">
                  {/* Gender */}
                  <select
                    className={
                      filterStyleForGender +
                      " cursor-pointer text-[#073937] bg-colorY2"
                    }
                    name="forWhichGender"
                    id="gender"
                    onChange={(event) =>
                      setFilters({
                        ...filters,
                        forWhichGender: event.target.value,
                      })
                    }
                    value={filters.forWhichGender}
                  >
                    <option value="">Select Gender</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="both">Both</option>
                  </select>

                  {/* Pricing */}
                  <input
                    className={filterStyle + " appearance-none"}
                    placeholder="Min Price"
                    type="number"
                    name="minPrice"
                    id="minPrice"
                    onChange={(event) =>
                      setFilters({ ...filters, minPrice: event.target.value })
                    }
                    value={filters.minPrice}
                  />
                  <input
                    className={filterStyle + " appearance-none"}
                    placeholder="Max Price"
                    type="number"
                    name="maxPrice"
                    id="maxPrice"
                    onChange={(event) =>
                      setFilters({ ...filters, maxPrice: event.target.value })
                    }
                    value={filters.maxPrice}
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
          </div>

          {hostelsCard}
          {hostelsCard}
          {hostelsCard}
          {hostelsCard}
        </div>
      </div>
    </div>
  );
}
