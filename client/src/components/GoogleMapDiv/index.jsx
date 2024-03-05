import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    // checks if the google object is available
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      reject(new Error("Google Maps API is not available."));
      return;
    }
    // geocode the address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      // check if the geocode was successful
      if (status === "OK" && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        // if the geocode was not successful, reject the promise
        reject(
          new Error(
            `Geocode was not successful for the following reason: ${status}`
          )
        );
      }
    });
  });
};

const GoogleMapDiv = ({ addresses }) => {
  const [locations, setLocations] = useState([]);

  // Fetch the locations when the component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      await new Promise((resolve) => {
        const checkGoogleAPI = () => {
          if (window.google && window.google.maps) {
            resolve();
          } else {
            setTimeout(checkGoogleAPI, 100); // Retry after 100 milliseconds
          }
        };
        checkGoogleAPI();
      });

      const locationsData = await Promise.all(
        addresses.map(async (address) => {
          try {
            return await geocodeAddress(address);
          } catch (error) {
            console.error(
              `Error geocoding address "${address}": ${error.message}`
            );
            return null;
          }
        })
      );

      setLocations(locationsData.filter((location) => location !== null));
    };

    fetchLocations();
  }, [addresses]);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const centerSum = locations.reduce(
    (acc, location) => {
      return {
        lat: acc.lat + location.lat,
        lng: acc.lng + location.lng,
      };
    },
    { lat: 0, lng: 0 }
  );

  const center = {
    lat: centerSum.lat / locations.length,
    lng: centerSum.lng / locations.length,
  };

  return (
    <LoadScript
      libraries={["places"]}
      googleMapsApiKey="AIzaSyCR_yl9s_fGqzm4enDuQ_4elU6H1xSPOa4"
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
      >
        {locations.map((location, index) => (
          <Marker key={index} position={location} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export { GoogleMapDiv };
