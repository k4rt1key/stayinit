import React, { useContext, useEffect, useState } from "react"
import { useAuth } from "../contexts/Auth"
import { Link, useLoaderData } from "react-router-dom"

import LikedCard from "../components/LikedCard"

import { getFirstImage } from "../utils/utilityFunctions"

export default function likes() {

    const likedProperty = useLoaderData();
    const [totalLikes, setTotalLikes] = useState(() => likedProperty.length)

    const likedPropertyCards = likedProperty.map((property) => {
        return (
            <LikedCard
                key=            {property._id}
                flatOrHostel=   {property.flat || property.hostel}
                name=           {property.flat ? property.flat.name : property.hostel.name}
                locality=       {property.flat ? property.flat.locality : property.locality}
                city=           {property.flat ? property.flat.city : property.hostel.city}
                type={property.flat ? "flat" : "hostel"}
            />
        )
    })

    return (
        <div>
            <div className="p-6 text-center w-full font-Classy text-xl">Total {totalLikes} likes</div>
            <div className="w-full flex flex-row flex-wrap gap-10 justify-center items-center p-6">
                {likedPropertyCards.length > 0 ? likedPropertyCards :
                    <div className="p-4 flex flex-col gap-4">
                        <h1 className="text-2xl">Nothing is liked...</h1>
                        <Link to="/flats" className="bg-colorG rounded-[1rem] text-[#FFFBF2] text-center px-4 py-4">Go to Flats</Link>
                        <Link to="/hostels" className="bg-colorG rounded-[1rem] text-[#FFFBF2] text-center px-4 py-4">Go to Hostels</Link>
                    </div>}
            </div>
        </div>
    )
}