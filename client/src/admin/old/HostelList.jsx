import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const HostelList = ({ onEdit }) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null); // State to hold selected hostel
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/hosteladmin/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setHostels(response.data);
    } catch (error) {
      setError("Error fetching hostels.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/hosteladmin/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchHostels(); // Refresh the list after deletion
    } catch (error) {
      setError("Error deleting hostel.");
    }
  };

  const handleViewDetails = (hostel) => {
    setSelectedHostel(hostel); // Set the selected hostel for the modal
    setShowModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHostel(null); // Clear selected hostel when modal closes
  };

  if (loading) return <p>Loading hostels...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Hostels List</h2>
      <ul className="space-y-4">
        {hostels?.map((hostel) => (
          <li key={hostel._id} className="flex justify-between items-center">
            <span>
              {hostel.name} - {hostel.city}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleViewDetails(hostel)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                <FontAwesomeIcon icon={faEye} /> {/* Eye Icon */}
              </button>
              <button
                onClick={() => onEdit(hostel)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                <FontAwesomeIcon icon={faEdit} /> {/* Edit Icon */}
              </button>
              <button
                onClick={() => handleDelete(hostel._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                <FontAwesomeIcon icon={faTrash} /> {/* Trash Icon */}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[25rem]">
            <h2 className="text-xl font-semibold mb-4">
              {selectedHostel.name}
            </h2>
            <p>
              <strong>Manager:</strong> {selectedHostel.manager}
            </p>
            <p>
              <strong>Price per Month:</strong> {selectedHostel.pricePerMonth}
            </p>
            <p>
              <strong>Rooms Available:</strong> {selectedHostel.roomsAvailable}
            </p>
            <p>
              <strong>Location:</strong> {selectedHostel.location},{" "}
              {selectedHostel.city}
            </p>
            <p>
              <strong>Contact:</strong> {selectedHostel.contactNumber}
            </p>
            <p>
              <strong>Email:</strong> {selectedHostel.contactEmail}
            </p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelList;
