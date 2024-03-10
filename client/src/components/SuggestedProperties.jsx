import React, { useState, useEffect } from "react";

import { Button, Text, Img } from "../components";
import LandingPageCard from "./LandingPageCard";

export default function SuggestedProperties(likesLength) {
  const landingPageCardPropList = [{}, {}, {}, {}, {}, {}];
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col md:gap-10 gap-[60px] md:h-auto items-start justify-start max-w-[1200px] mx-auto w-full">
        {/* featured property - title  */}
        <div className="flex flex-col gap-6 items-start justify-start w-full">
          <div className="flex flex-col gap-10 items-center justify-between w-full">
            <Text className="text-2xl md:text-4xl sm:text-[32px] md:text-[34px] text-gray-900 tracking-[-0.72px] w-auto">
              Featured Properties
            </Text>
            <Button
              className="common-pointer bg-transparent cursor-pointer flex items-center justify-center min-w-[124px]"
              onClick={() => navigate("/listing")}
              rightIcon={
                <Img
                  className="h-6 mb-[3px] ml-2"
                  src="/images/img_arrowright.svg"
                  alt="arrow_right"
                />
              }
            >
              <div className="font-bold text-left text-lg text-orange-A700">
                Explore All
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
  );
}
