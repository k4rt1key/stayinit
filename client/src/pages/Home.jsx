import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { Button, Img, Input, Text } from "../components";
import LandingPageCard from "../components/LandingPageCard";

export default function Home() {
  const navigate = useNavigate();

  const landingPageCardPropList = [{}, {}, {}, {}, {}, {}, {}];

  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("flat");

  return (
    <>
      <div
        className="
        px-[0.7rem] lg:px-[10rem]
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
              <Text className="text-4xl font-1 leading-[3.25rem]">
                Find a perfect property
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
                      ? "bg-colorG text-white"
                      : "bg-gray-300 text-colorG "
                  } cursor-pointer font-semibold py-3 rounded-[10px] text-center text-lg w-full`}
                >
                  Flat
                </Button>
                <Button
                  onClick={() => setType("hostel")}
                  className={`${
                    type === "hostel"
                      ? "bg-colorG text-white"
                      : "bg-gray-300 text-colorG "
                  } cursor-pointer font-semibold py-3 rounded-[10px] text-center text-lg w-full`}
                >
                  Hostels
                </Button>
              </div>
              <form className="flex flex-col gap-6 items-start justify-start w-full">
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
                <Link
                  to={`/listing/${type}?search=${search}`}
                  className="bg-colorG cursor-pointer font-semibold py-[17px] rounded-[10px] text-center text-lg text-white w-full"
                >
                  Search
                </Link>
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

        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col md:gap-10 gap-[60px] md:h-auto items-start justify-start max-w-[1200px] mx-auto w-full">
            {/* featured property - title  */}
            <div className="flex flex-col gap-6 items-start justify-start w-full">
              <div className="flex flex-col gap-10 items-center justify-cemter w-full">
                <Text className="text-2xl sm:text-[32px] md:text-[34px] text-gray-900 tracking-[-0.72px] w-auto">
                  Featured Properties
                </Text>
                <Button
                  className="common-pointer bg-transparent cursor-pointer flex items-center justify-center min-w-[124px]"
                  onClick={() => navigate("/listing/flat")}
                  rightIcon={
                    <Img
                      className="h-6 mb-[3px] ml-2"
                      src="/images/img_arrowright.svg"
                      alt="arrow_right"
                    />
                  }
                >
                  <div className="font-bold text-left text-lg text-orange-A700">
                    Explore All Flats
                  </div>
                </Button>
              </div>
            </div>

            {/* cards */}
            <div className="flex flex-col items-start justify-start w-full">
              <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 justify-center w-full">
                {landingPageCardPropList.map((props, index) => (
                  <React.Fragment key={`LandingPageCard${index}`}>
                    <LandingPageCard
                      className="flex flex-col md:h-auto items-start rounded-[1rem] justify-start w-full"
                      {...props}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
