export async function getlikes({ request, params }) {
    try {
        const requestObject = {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }

        const response = await fetch(`http://localhost:5000/api/v1/likes`, requestObject)
        const jsonResponse = await response.json()

        if (jsonResponse.success === true) {
            return jsonResponse.data;
        }

        else {
            throw new Error(jsonResponse.message)
        }
    }

    catch (error) {
        throw new Error(error.message)
    }
}