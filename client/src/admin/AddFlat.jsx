import React, { useState, useEffect } from "react";
import axios from "axios";
import addFlat from "../BackendUtils/addFlat";
import { redirect, useNavigate } from "react-router-dom";

const FlatForm = ({ selectedFlat, onSuccess, editMode }) => {
  const [flat, setFlat] = useState({
    uniqueName: "",
    name: "",
    developer: "",
    price: "",
    bhk: "",
    sqft: "",
    furnitureType: "",
    address: "",
    locality: "",
    city: "",
    pincode: "",
    addressLink: "",
    contactNumber: "",
    contactEmail: "",
    atWhichFloor: "",
    totalFloors: "",
    description: "",
    bathrooms: "",
    isFeatured: false,
  });

  useEffect(() => {
    if (selectedFlat) {
      setFlat(selectedFlat);
    }
  }, [selectedFlat]);

  const handleChange = (e) => {
    setFlat({ ...flat, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = await addFlat(flat, token);
      if (data.success) {
        alert(data.message);
        navigate("/dashboard/flatlist");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error while adding flat");
    }
  };

  return (
    <section className="px-[1.5rem] lg:px-[10rem] py-[2rem] w-full gap-6 flex flex-col">
      <h2 className="text-2xl font-1 font-semibold text-gray-800 mb-4">
        Add New Flat
      </h2>
      <button
        className="bg-color2 w-[15rem] text-white px-4 py-3 font-1"
        onClick={() => navigate("/dashboard/flatlist")}
      >
        Back to your flats
      </button>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 rounded-lg w-full"
      >
        <input
          type="text"
          name="uniqueName"
          value={flat.uniqueName}
          onChange={handleChange}
          placeholder="Unique Name"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="name"
          value={flat.name}
          onChange={handleChange}
          placeholder="Flat Name"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="developer"
          value={flat.developer}
          onChange={handleChange}
          placeholder="Developer"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="number"
          name="price"
          value={flat.price}
          onChange={handleChange}
          placeholder="Price"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="number"
          name="bhk"
          value={flat.bhk}
          onChange={handleChange}
          placeholder="BHK"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="number"
          name="sqft"
          value={flat.sqft}
          onChange={handleChange}
          placeholder="Square Feet"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <select
          name="furnitureType"
          value={flat.furnitureType}
          onChange={handleChange}
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        >
          <option value="none">Please Select Furniture Options</option>
          <option value="furnished">Furnished</option>
          <option value="unfurnished">Unfurnished</option>
          <option value="semifurnished">Semi-furnished</option>
        </select>
        <input
          type="text"
          name="address"
          value={flat.address}
          onChange={handleChange}
          placeholder="Address"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="locality"
          value={flat.locality}
          onChange={handleChange}
          placeholder="Locality"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="city"
          value={flat.city}
          onChange={handleChange}
          placeholder="City"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="pincode"
          value={flat.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="addressLink"
          value={flat.addressLink}
          onChange={handleChange}
          placeholder="Address Link"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="contactNumber"
          value={flat.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="email"
          name="contactEmail"
          value={flat.contactEmail}
          onChange={handleChange}
          placeholder="Contact Email"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <textarea
          name="description"
          value={flat.description}
          onChange={handleChange}
          placeholder="Description"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
        />
        <input
          type="number"
          name="bathrooms"
          value={flat.bathrooms}
          onChange={handleChange}
          placeholder="Number of Bathrooms"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="number"
          name="atWhichFloor"
          value={flat.atWhichFloor}
          onChange={handleChange}
          placeholder="At Which Floor"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="number"
          name="totalFloors"
          value={flat.totalFloors}
          onChange={handleChange}
          placeholder="Total Floors"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <button
          type="submit"
          className="bg-color2 text-white px-4 py-2 rounded"
        >
          {editMode ? "Update Flat" : "Add Flat"}
        </button>
      </form>
    </section>
  );
};

export default FlatForm;
