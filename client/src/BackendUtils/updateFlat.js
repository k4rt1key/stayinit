import axios from "axios"

export default async function addFlat(flat, token) {
    try {
        const reponse = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/flatadmin/update/${flat._id
            }`,
            flat,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return {
            success: true,
            data: reponse.data.data,
            message: "Flats Updated Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Updated Flats!!!"
        }
    }
};