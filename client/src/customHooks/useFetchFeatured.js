import { useState, useEffect } from "react";

export default function useFetchFeatured() {
    try {
        const [properties, setProperties] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");


        async function init() {
            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            };
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL
                }/api/v1/featured/hostel`,
                requestOptions
            );
            const jsonResponse = await response.json();
            console.log("JSON RESPONSE", jsonResponse)

            if (jsonResponse.success === true) {
                setProperties(jsonResponse.data);
                setLoading(false);
            } else {
                throw new Error(jsonResponse.message);
            }
        }

        useEffect(() => {
            setLoading(true);
            init();
        }, []);

        return [properties, loading, error];
    } catch (error) {
        // toast.error(error.message);
        throw new Error(error.message);
    }
}