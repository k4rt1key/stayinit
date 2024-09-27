import axios from "axios"

export default async function getFlats(token) {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/flatadmin/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
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
