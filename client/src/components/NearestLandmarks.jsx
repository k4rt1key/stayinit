import React from "react";

export default function NearestLandmarks({ nearestLandmarksForSearching }) {

    let nearestLandmarksDivs = []

    if (nearestLandmarksForSearching) {

        nearestLandmarksDivs = nearestLandmarksForSearching.map((oneLandmark) => {

            const km = oneLandmark.distance;
            const location = oneLandmark.place;
            return (
                <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
                    <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
                        <span className="text-xs">from </span>
                        <span className="font-bold">{location}</span>
                    </div>
                    <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                        {km} km
                    </div>
                </div>
            )
        })
    }

    return (
        <div className=" cursor-pointer hover:bg-colorY2H rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex items-center flex-col w-full h-auto min-w-[300px] max-w-[600px]">
            <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                <h3>
                    <a href="" rel="noopener noreferrer" target="_blank">
                        Nearest Landmarks
                    </a>
                </h3>
            </div>
            {nearestLandmarksDivs}
        </div>
    )
}