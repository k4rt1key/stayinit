import React, { useState, useEffect } from "react"
import { useLoaderData, useSearchParams } from "react-router-dom";

import { useAuth } from "../contexts/Auth"
import { Spinner } from "@material-tailwind/react";

import FlatFilters from "../components/Flat/FlatFilters"
import Cards from "../components/Flat/Cards"

export default function FlatListing() {

    const [searchParams, setSearchParams] = useSearchParams()
    const flats = useLoaderData()
        
    const filters = {
        minPrice: Number(searchParams.get("minPrice")),
        maxPrice: Number(searchParams.get("maxPrice")),
        minSqft: Number(searchParams.get("minSqft")),
        maxSqft: Number(searchParams.get("maxSqft")),
        bhk: Number(searchParams.get("bhk")),
        furnitureType: searchParams.get("furnitureType"),
    }


    const filteredFlats = flats.filter((singleFlat) => {

        const {
            price,
            sqft,
            bhk,
            furnitureType
        } = singleFlat

        const filterExpression =
            (filters.minPrice ? Number(filters.minPrice) <= Number(price) : true) &&
            (filters.maxPrice ? Number(filters.maxPrice) >= Number(price) : true) &&
            (filters.minSqft ? Number(filters.minSqft) <= Number(sqft) : true) &&
            (filters.maxSqft ? Number(filters.maxSqft) >= Number(sqft) : true) &&
            (filters.bhk ? Number(filters.bhk) === Number(bhk) : true) &&
            (filters.furnitureType ? filters.furnitureType.toLowerCase() === furnitureType : true)

        return filterExpression;

    })

    return (
        <div>
            <FlatFilters />
            {!flats ? <Spinner color="white" size="sm" /> : <Cards flats={filteredFlats} />}
        </div>
    );

}