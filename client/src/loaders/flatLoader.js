import { toast } from 'react-toastify';

export async function flatLoader({ request, params }) {

    try {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        const { flatname } = params
        const response = await fetch(`http://localhost:5000/api/v1/flat/${flatname}`, requestOptions);
        const jsonResponse = await response.json();

        if (jsonResponse.success === true) {
            return jsonResponse.data;
        }

        else {
            toast.error(jsonResponse.message);
            throw new Error(jsonResponse.message)

        }
    }

    catch (error) {
        toast.error(error.message);
        throw new Error(error.message)
    }
}