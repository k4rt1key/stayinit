function roundToNearestThousand(number) {
    return Math.round(number / 1000) * 1000;
}

function extractCoordinatesFromUrl(url) {
    // Extract the part of the URL containing the coordinates
    const match = url?.match(/@(.+),(.+),.*/);

    if (!match) {
        return null; // No match found
    }

    // Extract latitude and longitude
    const latitude = match[1];
    const longitude = match[2];

    return `${latitude},${longitude}`;
}

export { roundToNearestThousand, extractCoordinatesFromUrl }