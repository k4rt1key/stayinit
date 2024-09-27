import React, { useState, useEffect } from "react";
import LandingPageCardForOwner from "../components/LandingPageCardForOwner";

const OwnedFlats = ({ flats }) => {
  return (
    <div className="w-full grid grid-cols-3 gap-4 flex-wrap">
      {flats.length == 0 && <div>No flats found!!!</div>}
      {flats.map((f) => {
        return (
          <>
            <LandingPageCardForOwner
              className={
                "flex flex-col md:h-auto items-start rounded-[1rem] justify-start"
              }
              flat={f}
            />
          </>
        );
      })}
    </div>
  );
};

export default OwnedFlats;
