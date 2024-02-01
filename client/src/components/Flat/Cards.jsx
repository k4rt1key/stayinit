import React from "react"
import Card from "./Card"

export default function Cards({ flats }) {

    const length = flats.length;
    const flatCards = flats.map((flat) => {
        return (
            <Card key={flat._id} flat={flat} />
        )
    })

    return (
        <>
            <div className="flex flex-row justify-center items-center">
                <button className="bg-colorG rounded-[1rem] text-[#FFFBF2] text-center px-4 py-4">Filters</button>
                <p className="px-4 font-bold text-xl">Showing {length} {length === 1 ? "property" : "properties"} </p>
            </div>
            <div>
                {flatCards}
            </div>
        </>
    )
}