import axios from "axios"

export default async function getFlat(flatname) {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/flat/${flatname}`,
        );
        return {
            data: response.data.data,
            success: true,
            message: "Flat Fetched Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Fetching Flats!!!"
        }
    }
};
