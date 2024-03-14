import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { Button, Img, Input, Text } from "../components";
import FeaturedProperties from "../components/FeaturedProperties";

export default function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("flat");

  console.log(type, search);

  return (
    <>
      <div
        className="
        px-[1.5rem] lg:px-[10rem]
        flex flex-col gap-10
        items-center justify-start  
        overflow-x-hidden
        w-auto"
      >
        {/* heading */}
        <div
          className="
          flex md:flex-row flex-col gap-10 items-center justify-start w-full
          py-10"
        >
          {/* heading + input */}
          <div className="w-full flex flex-col gap-10 items-start justify-start">
            {/* heading text */}
            <div className="w-full flex flex-col gap-4 items-start justify-start">
              <Text className="text-3xl md:text-4xl font-1 leading-[3.25rem]">
                Find a perfect Hostel & Flat
                <br />
                Where you&#39;ll love to live
              </Text>
              <Text className="text-lg lg:text-xl lg:leading-[2rem] text-gray-600 text-md">
                We helps businesses customize, automate and scale up their ad
                production and delivery.
              </Text>
            </div>
            {/* inputs */}
            <div className="flex flex-col gap-[38px] items-center justify-start w-full">
              {/* Flat Or Hostel */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                <Button
                  onClick={() => setType("flat")}
                  className={`${
                    type === "flat"
                      ? "bg-color2 text-white"
                      : "bg-gray-300 text-colorG "
                  } cursor-pointer font-semibold py-3 rounded-[10px] text-center text-lg w-full`}
                >
                  Flat
                </Button>
                <Button
                  onClick={() => setType("hostel")}
                  className={`${
                    type === "hostel"
                      ? "bg-color2 text-white"
                      : "bg-gray-300 text-colorG "
                  } cursor-pointer font-semibold py-3 rounded-[10px] text-center text-lg w-full`}
                >
                  Hostels
                </Button>
              </div>
              <form
                className="flex flex-col gap-6 items-start justify-start w-full"
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate(`/listing/${type}?search=${search}`);
                }}
              >
                <div className="flex flex-col gap-5 items-start justify-start w-full">
                  {/* input - city */}
                  <Input
                    name="textfieldlarge"
                    placeholder="Search by City, Locality, or Property's name"
                    className="focus:border-transparent outline-none placeholder:text-gray-600 text-gray-600 text-left md:text-xl text-md w-full"
                    wrapClassName="bg-white border border-solid flex pb-3.5 pt-5 px-4 rounded-[10px] w-full"
                    suffix={
                      <Img
                        className="mt-auto mb-[5px] h-5 ml-[35px]"
                        src="/images/img_location.svg"
                        alt="location"
                      />
                    }
                    value={search}
                    onChange={(event) => {
                      setSearch(event);
                    }}
                  ></Input>
                </div>

                {/* search */}
                <button className="bg-color2 cursor-pointer font-semibold py-[17px] rounded-[10px] text-center text-lg text-white w-full">
                  Search
                </button>
              </form>
            </div>
          </div>
          {/* home page image */}
          <div className="w-full hidden lg:flex flex-col gap-10 items-center justify-center">
            <Img
              className="w-full h-full object-cover"
              src="/images/img_image.png"
              alt="image"
            />
          </div>
        </div>

        <FeaturedProperties />
      </div>
    </>
  );
}
