export async function fetchFlatsInfo({ request, params}) {

    try {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch("http://localhost:5000/api/v1/flat", requestOptions);
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