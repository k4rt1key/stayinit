import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom";

import { Spinner } from "@material-tailwind/react";

import HostelFilters from "../components/Hostel/HostelFilters"
import Cards from "../components/Hostel/Cards"

export default function HostelListing() {

    const [searchParams, setSearchParams] = useSearchParams()

    const [hostels, sethostels] = useState([]);

    const [loading, setLoading] = useState(true);

    async function fetchhostels() {
        const response = await fetch("http://localhost:5000/api/v1/hostel");
        const jsonResponse = await response.json();
        const data = jsonResponse.data;
        sethostels(data);
    }

    useEffect(() => {
        setLoading(true);
        fetchhostels();
        setLoading(false);
    }, [])

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
            {loading ? <Spinner color="white" size="sm" /> : <Cards hostels={filteredHostels} />}
        </div>
    );

}