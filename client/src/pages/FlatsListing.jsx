import React, { useState, useEffect } from "react"
import { useLoaderData, useSearchParams } from "react-router-dom";

import { Spinner } from "@material-tailwind/react";

import Cards from "../components/Flat/Cards"


function useFetch(searchParams) {
    try {

        const [flats, setFlats] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");

        async function init(searchParams) {
            const search = searchParams.get("search");
            let searchQuery = "";
            if (search) {
                searchQuery = "?search=" + search;
            } else {
                searchQuery = "";
            }

            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };

            const response = await fetch("http://localhost:5000/api/v1/flat" + searchQuery, requestOptions);
            const jsonResponse = await response.json();

            if (jsonResponse.success === true) {
                setFlats(jsonResponse.data);
            }

            else {
                toast.error(jsonResponse.message);
                throw new Error(jsonResponse.message)
            }
        }

        useEffect(() => {
            setLoading(true);
            init(searchParams);
            setLoading(false);
        }, []);

        return { flats, loading, error };
    }

    catch (error) {
        toast.error(error.message);
        throw new Error(error.message)
    }
}

export default function FlatListing() {

    const [searchParams, setSearchParams] = useSearchParams();
    const { flats, loading, error } = useFetch(searchParams);

    return (
        <div>
            {loading ?
                <div className="flex justify-center items-center h-screen">
                    <Spinner color="black" size="lg" />
                </div>
                : <Cards flats={flats} />}
        </div>
    );

}