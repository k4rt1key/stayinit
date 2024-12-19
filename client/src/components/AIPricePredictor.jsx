import React, { useState } from "react";

const AIPricePredictor = ({ property }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const getPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        property_sqft: property.sqft || 0,
        property_bhk: property.bhk || 0,
        property_city: property.city || "",
        property_locality: property.locality || "",
        is_furnished: property.furnished || "unfurnished",
        property_project: property.name || "",
        num_of_baths: property.bathrooms || 0,
        bachelors_or_family: property.preferredTenants || "both",
        floornumber: property.atWhichFloor || 0,
        totalfloor: property.totalFloor || 0,
        // Including nan fields as required by the API
        property_pricenan: 0,
        property_bhknan: 0,
        property_sqftnan: 0,
        num_of_bathsnan: 0,
        floornumbernan: 0,
        totalfloornan: 0,
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        setError(data.error || "Failed to get prediction");
      }
    } catch (err) {
      setError("Failed to connect to prediction service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <button
        onClick={getPrediction}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span className="ml-2">Getting AI Prediction...</span>
          </div>
        ) : (
          "See Expected Price by AI"
        )}
      </button>

      {prediction && !error && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">AI Predicted Price:</p>
          <p className="text-2xl font-bold text-indigo-600">
            ₹{Math.round(prediction).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            *This is an estimated price based on current market data
          </p>
        </div>
      )}

      {error && <div className="mt-4 text-center text-red-600">{error}</div>}
    </div>
  );
};

export default AIPricePredictor;
