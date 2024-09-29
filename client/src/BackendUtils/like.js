import axios from "axios"

export default async function like(type, propertyId, token) {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/likes/`, { type, propertyId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            data: response.data.data,
            success: true,
            message: "Liked Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Like!!!"
        }
    }
};
