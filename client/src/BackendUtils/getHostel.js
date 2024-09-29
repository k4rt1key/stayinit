import axios from "axios"

export default async function getHostel(hostelname) {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/hostel/${hostelname}`,
        );
        return {
            data: response.data.data,
            success: true,
            message: "Hostel Fetched Successfully!!!"
        }
    } catch (error) {
        return {
            success: false,
            error: "Error While Fetching Hostel!!!"
        }
    }
};
