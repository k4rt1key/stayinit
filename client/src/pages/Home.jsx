import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input, Button } from "@material-tailwind/react";
import { genNewSearchParamString } from "../utils/utilityFunctions";

export default function Home() {
  const [search, setSearch] = React.useState("");
  const [propertyType, setPropertyType] = React.useState("flat");

  const navigate = useNavigate();

  async function searchProperties(event) {
    event.preventDefault();
    try {
      navigate("/" + propertyType + "s?search=" + search);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return (
    <div className="flex flex-col gap-10 h-full justify-center items-center bg-[#FFFBF2]">
      {/* hero section */}
      <div className="md:w-[40rem] w-[20rem] flex flex-col gap-10">
        {/* search */}
        <div className="flex flex-col gap-10">
          <h1 className="text-4xl font-Classy">
            Search most value for money flats and hostels
          </h1>
          <form onSubmit={searchProperties} className="flex flex-col gap-4">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="rounded-[4rem] text-white px-5 py-3 bg-colorG"
            >
              <option value="flat">Flat</option>
              <option value="hostel">Hostel</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="rounded-[4rem] border-2 border-[#073937] px-5 py-3 "
            />
            <button className="rounded-[4rem] text-white px-5 py-3 bg-colorG">
              {" "}
              Search{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
