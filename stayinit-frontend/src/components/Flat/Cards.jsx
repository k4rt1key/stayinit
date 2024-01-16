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
            <p className="px-4 w-full text-center font-bold text-xl">Showing {length} result</p>
            <div>
                {flatCards}
            </div>
        </>
    )
}