import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function useFetchProperty() {
    const [property, setProperty] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { type, propertyname } = useParams();
    async function init(type, propertyname) {
        if (type == "undefined" || propertyname == "undefined") {
            setError("Invalid URL");
        }
        setLoading(true);
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };

        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/${type}/${propertyname}`,
            requestOptions
        );
        const jsonResponse = await response.json();

        if (jsonResponse.success === true) {
            setProperty(jsonResponse.data);
            setLoading(false);
        } else {
            toast.error(jsonResponse.message);
            // throw new Error(jsonResponse.message);
        }
    }

    useEffect(() => {
        init(type, propertyname);
    }, [type, propertyname]);

    return [property, loading, error];
}
