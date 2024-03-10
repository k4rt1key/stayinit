import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function useFetchLikes(likesLength) {
    try {
        const [likes, setLikes] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);

        async function init() {
            setLoading(true);
            const requestObject = {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/likes`,
                requestObject
            );
            const jsonResponse = await response.json();

            if (jsonResponse.success === true) {
                setLikes(jsonResponse.data);
                setLoading(false);
            } else {
                toast.error(jsonResponse.message);
                throw new Error(jsonResponse.message);
            }
        }

        useEffect(() => {
            init();
        }, [likesLength]);

        return [likes, loading, error];
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
}