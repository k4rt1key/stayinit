import axios from "axios"

export default async function unlike(type, propertyId, token) {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/likes/${type}/${propertyId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            data: response.data.data,
            success: true,
            message: "unliked Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While unlike!!!"
        }
    }
};
