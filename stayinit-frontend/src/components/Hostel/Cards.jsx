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
            <p className="px-4 w-full text-center font-bold text-xl">Showing {length} result</p>
            <div>
                {hostelsCard}
            </div>
        </>
    )
}