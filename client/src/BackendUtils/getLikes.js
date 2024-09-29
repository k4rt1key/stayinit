import axios from "axios"

export default async function getLikes(token) {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/likes/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            data: response.data.data,
            success: true,
            message: "Fetched Likes Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Fetching Likes!!!"
        }
    }
};
