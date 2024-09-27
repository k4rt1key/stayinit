import React, { useState, useEffect } from "react";
import axios from "axios";

const HostelForm = ({ selectedHostel, onSuccess, onCancel }) => {
  const [hostel, setHostel] = useState({
    uniqueName: "",
    name: "",
    manager: "",
    pricePerMonth: "",
    roomsAvailable: "",
    location: "",
    city: "",
    pincode: "",
    addressLink: "",
    contactNumber: "",
    contactEmail: "",
    addedBy: "",
  });

  useEffect(() => {
    if (selectedHostel) {
      setHostel(selectedHostel);
    }
  }, [selectedHostel]);

  const handleChange = (e) => {
    setHostel({ ...hostel, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedHostel) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/hosteladmin/update/${
            hostel._id
          }`,
          hostel,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/hosteladmin/add`,
          hostel,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving hostel:", error.message);
    }
  };

  return (
    <section className="w-full flex justify-center items-center  py-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[25rem] gap-4 bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          {selectedHostel ? "Update Hostel" : "Add New Hostel"}
        </h2>

        <input
          type="text"
          name="uniqueName"
          value={hostel.uniqueName}
          onChange={handleChange}
          placeholder="Unique Name"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="name"
          value={hostel.name}
          onChange={handleChange}
          placeholder="Hostel Name"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="manager"
          value={hostel.manager}
          onChange={handleChange}
          placeholder="Manager"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="number"
          name="pricePerMonth"
          value={hostel.pricePerMonth}
          onChange={handleChange}
          placeholder="Price per Month"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="number"
          name="roomsAvailable"
          value={hostel.roomsAvailable}
          onChange={handleChange}
          placeholder="Rooms Available"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="location"
          value={hostel.location}
          onChange={handleChange}
          placeholder="Location"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="city"
          value={hostel.city}
          onChange={handleChange}
          placeholder="City"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="pincode"
          value={hostel.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="addressLink"
          value={hostel.addressLink}
          onChange={handleChange}
          placeholder="Address Link"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="text"
          name="contactNumber"
          value={hostel.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />
        <input
          type="email"
          name="contactEmail"
          value={hostel.contactEmail}
          onChange={handleChange}
          placeholder="Contact Email"
          className="border-2 border-[#d5bf9f] rounded-lg px-3 py-2 focus:outline-none placeholder:text-[#073937]"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {selectedHostel ? "Update Hostel" : "Add Hostel"}
        </button>

        <button type="button" className="mt-2 text-red-500" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </section>
  );
};

export default HostelForm;
