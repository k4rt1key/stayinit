import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

export default function useFetchListing(searchParams) {
    try {
        const [properties, setProperties] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");

        const { type } = useParams();

        async function init(searchParams) {
            setLoading(true);
            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            };

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL
                }/api/v1/${type}?${searchParams.toString()}`,
                requestOptions
            );
            const jsonResponse = await response.json();

            setLoading(false);
            if (jsonResponse.success === true) {
                setProperties(jsonResponse.data);
            } else {
                // toast.error(jsonResponse.message);
                throw new Error(jsonResponse.message);
            }
        }

        useEffect(() => {
            init(searchParams);
        }, [searchParams]);

        return [properties, loading, error];
    } catch (error) {
        // toast.error(error.message);
        throw new Error(error.message);
    }
}