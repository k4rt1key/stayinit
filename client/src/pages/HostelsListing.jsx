import React, { useState, useEffect } from "react"
import { useLoaderData, useSearchParams } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import Cards from "../components/Hostel/Cards"


function useFetch(searchParams) {
    try {

        const [hostels, setHostels] = useState([]);
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

            const response = await fetch("http://localhost:5000/api/v1/hostel" + searchQuery, requestOptions);
            const jsonResponse = await response.json();

            if (jsonResponse.success === true) {
                setHostels(jsonResponse.data);
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

        return { hostels, loading, error };
    }

    catch (error) {
        toast.error(error.message);
        throw new Error(error.message)
    }
}

export default function HostelListing() {

    const [searchParams, setSearchParams] = useSearchParams();
    const { hostels, loading, error } = useFetch(searchParams)

    if (!loading) {
        return (
            <div>
                <Cards hostels={hostels} />
            </div>
        );
    } else {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner color="green" className="h-16 w-16" />
            </div>
        )
    }

}