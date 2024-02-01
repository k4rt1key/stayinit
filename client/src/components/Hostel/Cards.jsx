import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../../contexts/Auth"
import { Spinner } from "@material-tailwind/react";

import Card from "./Card"

export default function Cards({ hostels }) {
    const length = hostels.length;

    const hostelsCard = hostels.map((hostel) => {
        return (
            <Card key={hostel._id} hostel={hostel} />
        )
    })

    return (
        <>
            <div className="flex flex-row justify-center items-center">
                <button className="bg-colorG rounded-[1rem] text-[#FFFBF2] text-center px-4 py-4">Filters</button>
                <p className="px-4 font-bold text-xl">Showing {length} {length === 1 ? "property" : "properties"} </p>
            </div>
            <div>
                {hostelsCard}
            </div>
        </>
    )
}