import axios from "axios"

export default async function getFeaturedFlats() {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/featured/flat`,
        );
        return {
            data: response.data.data,
            success: true,
            message: "Featured Flat Fetched Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Fetching Featured Flats!!!"
        }
    }
};
