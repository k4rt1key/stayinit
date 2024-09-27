import axios from "axios"

export default async function deleteFlat(flatId, token) {
    try {
        const reponse = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL
            }/api/v1/flatadmin/delete/${flatId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            success: true,
            data: reponse.data.data,
            message: "Flats Deleted Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Deleting Flats!!!"
        }
    }
};