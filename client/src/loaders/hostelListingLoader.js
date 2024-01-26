export async function hostelsLoader({ request, params }) {

    try {

        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const search = searchParams.get('search');

        let searchQuery = "";
        if (search) {
            searchQuery = "?search=" + search;
        } else {
            searchQuery = "";
        }

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await fetch("http://localhost:5000/api/v1/hostel"+searchQuery, requestOptions);
        const jsonResponse = await response.json();

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