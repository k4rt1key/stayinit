import { toast } from "react-toastify";

export default function propertyPageLoader({ params }) {

    const { type, propertyname } = params;


    async function init(type, propertyname) {
        let property = {}
        if (type == "undefined" || propertyname == "undefined") {
            throw new Error("Invalid URL");
        }
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
            property = jsonResponse.data;
        } else {
            toast.error(jsonResponse.message);
            throw new Error(jsonResponse.message);
        }
        return property;
    }

    return init(type, propertyname);

}
