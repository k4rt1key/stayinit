import axios from "axios"

export default async function getHostels(token) {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/hosteladmin/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            data: response.data.data,
            success: true,
            message: "Hostel Fetched Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Fetching Hostels!!!"
        }
    }
};
