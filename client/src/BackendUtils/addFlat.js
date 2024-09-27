import axios from "axios"

export default async function addFlat(flat, token) {
    try {
        const reponse = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/flatadmin/add`,
            flat,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            success: true,
            data: await reponse.data.data,
            message: "Flats Added Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Adding Flats!!!"
        }
    }
};