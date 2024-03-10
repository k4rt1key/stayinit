import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function useFetchListing(searchParams) {
    try {
        const [flats, setFlats] = useState([]);
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

            if (jsonResponse.success === true) {
                setFlats(jsonResponse.data);
                setLoading(false);
            } else {
                // toast.error(jsonResponse.message);
                throw new Error(jsonResponse.message);
            }
        }

        useEffect(() => {
            init(searchParams);
        }, [searchParams]);

        return [flats, loading, error];
    } catch (error) {
        // toast.error(error.message);
        throw new Error(error.message);
    }
}