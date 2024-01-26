import React, { useState, useEffect } from "react"
import { useLoaderData, useSearchParams } from "react-router-dom";

import { Spinner } from "@material-tailwind/react";

import HostelFilters from "../components/Hostel/HostelFilters"
import Cards from "../components/Hostel/Cards"

export default function HostelListing() {

    const [searchParams, setSearchParams] = useSearchParams()
    const hostels = useLoaderData()
   
    const filters = {
        "minPrice": Number(searchParams.get("minPrice")),
        "maxPrice": Number(searchParams.get("maxPrice")),

        "BoysOrGirls": searchParams.get("BoysOrGirls")?.toLowerCase()
    }

    const filteredHostels = hostels.filter((hostel) => {

        const {
            priceAndSharing, forWhichGender, acFacility, wifiFacility, gymFacility, freeLaundry
        } = hostel

        let minPrice = Infinity;
        let maxPrice = 0;

        minPrice = priceAndSharing.reduce((acc, curr) => {
            return (Math.min(minPrice, curr.price))
        }, Infinity)

        maxPrice = priceAndSharing.reduce((acc, curr) => {
            return (Math.max(maxPrice, curr.price))
        }, 0)

        const exp =
            (((filters.BoysOrGirls !== "None" && filters.BoysOrGirls)) ? forWhichGender === filters.BoysOrGirls : true) &&
            (filters.minPrice ? filters.minPrice <= maxPrice : true) &&
            (filters.maxPrice ? filters.maxPrice >= minPrice : true)

        return exp;

    })


    return (
        <div>
            <HostelFilters />
            <Cards hostels={filteredHostels} />
        </div>
    );

}