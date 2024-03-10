import React, { useState, useEffect } from "react";

function useFetchPrediction(property) {
    const [prediction, setPrediction] = useState(0);
    const [predictionError, setPredictionError] = useState("");
    const [predictionLoading, setPredictionLoading] = useState(false);

    useEffect(() => {
        const fetchDataInternal = async () => {
            try {
                setPredictionLoading(true);

                const sqft = parseInt(property.sqft);
                const bhk = parseInt(property.bhk);
                const city = property.city?.toLowerCase().replace(" ", "_");
                const locality = property.locality?.toLowerCase().replace(" ", "_");
                const furnitureType = property.furnitureType?.toLowerCase().replace(" ", "_");
                const project = property.name?.toLowerCase().replace(" ", "_");
                const bathrooms = parseInt(property.bathrooms);
                const atWhichFloor = parseInt(property.atWhichFloor);
                const totalFloor = parseInt(property.totalFloor);


                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        property_sqft: sqft,
                        property_bhk: bhk,
                        property_city: city,
                        property_locality: locality,
                        is_furnished: furnitureType,
                        property_project: project,
                        num_of_baths: bathrooms,
                        bachelors_or_family: "bachelors",
                        floornumber: atWhichFloor,
                        totalfloor: totalFloor,
                        property_pricenan: 0,
                        property_bhknan: 0,
                        property_sqftnan: 0,
                        num_of_bathsnan: 0,
                        floornumbernan: 0,
                        totalfloornan: 0,
                    }),
                };

                const response = await fetch(`${import.meta.env.VITE_ML_URL}`, options);
                const responseJson = await response.json();
                const data = responseJson.prediction;


                if (data && response.ok) {
                    setPrediction(data);
                    setPredictionLoading(false);
                } else {
                    setPrediction(null);
                    setPredictionError(responseJson.message);
                }
            } catch (error) {
                setPredictionError(error.message);
            }
        };

        if (property) {
            fetchDataInternal();
        }

    }, [property]);

    return [prediction, predictionLoading, predictionError];
}

export default useFetchPrediction;
