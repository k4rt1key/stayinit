import { useState, useEffect } from 'react';

function useFetch(url, options) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    async function fetchData(url) {
        try {
            const response = options ? await fetch(url, options) : await fetch(url);
            const result = await response.json();
            if (result.success === false) throw new Error(result.message);
            setData(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(url)
    }, [url])

    return { data, setData, loading, setLoading, error, setError, fetchData };
}

export default useFetch;
