import axios from "axios";

export async function addHostelImages(hostelId, images, token) {
    try {
        const formData = new FormData();

        // Append each image to the FormData
        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/hosteladmin/add-images/${hostelId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return {
            success: true,
            data: response.data.data,
            message: "Images added successfully!"
        };
    } catch (error) {
        console.error("Error in addHostelImages:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Error adding images"
        };
    }
}

export default async function addHostel(hostel, token) {
    try {
        const hostelData = { ...hostel };
        delete hostelData.images;

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/hosteladmin/add`,
            hostelData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("hostelData:", hostelData);
        

        if (response.data.success && hostel.images && hostel.images.length > 0) {
            const imageUploadResponse = await addHostelImages(response.data.data._id, hostel.images, token);

            if (!imageUploadResponse.success) {
                console.error("Failed to upload images:", imageUploadResponse.error);
            }
        }

        return {
            success: true,
            data: response.data.data,
            message: "Hostel added successfully!"
        };
    } catch (error) {
        console.error("Error in addHostel:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Error while adding hostel"
        };
    }
}