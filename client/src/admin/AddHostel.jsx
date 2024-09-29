import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import addHostel from "../BackendUtils/addHostel";

export default function AddHostelForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [hostelData, setHostelData] = useState({
    uniqueName: "",
    name: "",
    developer: "",
    forWhichGender: "",
    addressLink: "",
    address: "",
    locality: "",
    city: "",
    pincode: "",
    contactNumber: "",
    contactEmail: "",
    description: "",
    liftFacility: false,
    wifiFacility: false,
    gymFacility: false,
    acFacility: false,
    gamingRoom: false,
    freeLaundry: false,
    securityGuard: false,
    filterWater: false,
    cctv: false,
    cleaning: false,
    isFeatured: false,
    images: [],
    priceAndSharing: [],
  });

  const handleAddPriceAndSharing = () => {
    setHostelData((prevData) => ({
      ...prevData,
      priceAndSharing: [
        ...prevData.priceAndSharing,
        { sharing: "", price: "" },
      ],
    }));
  };

  const handlePriceAndSharingChange = (index, field, value) => {
    const updatedPriceAndSharing = hostelData.priceAndSharing.map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item
    );
    setHostelData({ ...hostelData, priceAndSharing: updatedPriceAndSharing });
  };

  const handleRemovePriceAndSharing = (index) => {
    const updatedPriceAndSharing = hostelData.priceAndSharing.filter(
      (item, idx) => idx !== index
    );
    setHostelData({ ...hostelData, priceAndSharing: updatedPriceAndSharing });
  };

  useEffect(() => {
    const savedData = localStorage.getItem("hostelFormData");
    if (savedData) {
      setHostelData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hostelFormData", JSON.stringify(hostelData));
  }, [hostelData]);

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    setHostelData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    setHostelData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const result = await addHostel(hostelData, token);

      if (result.success) {
        localStorage.removeItem("hostelFormData");
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  }

  function renderStepContent() {
    switch (step) {
      case 1:
        return (
          <>
            <input
              name="uniqueName"
              type="text"
              placeholder="Unique Name"
              value={hostelData.uniqueName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
            <input
              name="name"
              type="text"
              placeholder="Hostel Name"
              value={hostelData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
            <input
              name="developer"
              type="text"
              placeholder="Developer"
              value={hostelData.developer}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />

            <select
              name="forWhichGender"
              value={hostelData.forWhichGender}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            >
              <option value="">For Which Gender</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="both">Co-ed</option>
            </select>

            <div className="mt-4">
              <h4>Price and Sharing</h4>
              {hostelData.priceAndSharing.map((item, index) => (
                <div key={index} className="flex gap-2 space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Sharing"
                    value={item.sharing}
                    onChange={(e) =>
                      handlePriceAndSharingChange(
                        index,
                        "sharing",
                        e.target.value
                      )
                    }
                    className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      handlePriceAndSharingChange(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePriceAndSharing(index)}
                    className="font-1 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPriceAndSharing}
                className="mt-2 font-1 bg-indigo-300 text-white py-1 px-3 rounded"
              >
                Add Price and Sharing
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={hostelData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
            <input
              name="locality"
              type="text"
              placeholder="Locality"
              value={hostelData.locality}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
            <input
              name="city"
              type="text"
              placeholder="City"
              value={hostelData.city}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
            <input
              name="pincode"
              type="text"
              placeholder="Pincode"
              value={hostelData.pincode}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
            <input
              name="addressLink"
              type="text"
              placeholder="Address Link"
              value={hostelData.addressLink}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <input
              name="contactNumber"
              type="tel"
              placeholder="Contact Number"
              value={hostelData.contactNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
            <input
              name="contactEmail"
              type="email"
              placeholder="Contact Email"
              value={hostelData.contactEmail}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={hostelData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              rows="4"
            />
          </>
        );
      case 4:
        return (
          <>
            {[
              "liftFacility",
              "wifiFacility",
              "gymFacility",
              "acFacility",
              "gamingRoom",
              "freeLaundry",
              "securityGuard",
              "filterWater",
              "cctv",
              "cleaning",
              "isFeatured",
            ].map((facility) => (
              <div key={facility} className="flex items-center mt-2">
                <input
                  name={facility}
                  type="checkbox"
                  checked={hostelData[facility]}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={facility}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {facility.charAt(0).toUpperCase() +
                    facility
                      .slice(1)
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                </label>
              </div>
            ))}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
            />
            <div className="mt-2 text-sm text-gray-600">
              {hostelData.images.length} image(s) selected
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex bg-white">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-1 text-gray-900 mb-6">Add New Hostel</h2>
          <p className="text-sm text-gray-600 mb-8">Step {step} of 4</p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {renderStepContent()}

            <div className="flex gap-4 justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1908&q=80"
          alt="Hostel interior"
        />
      </div>
    </div>
  );
}
