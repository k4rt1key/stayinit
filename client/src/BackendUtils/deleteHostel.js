import axios from "axios"

export default async function deleteHostel(hostelId, token) {
    try {
        const reponse = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL
            }/api/v1/hosteladmin/delete/${hostelId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            success: true,
            data: reponse.data.data,
            message: "Hostel Deleted Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Deleting Hostel!!!"
        }
    }
};