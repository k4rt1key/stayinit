import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const FlatList = ({ onEdit }) => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch flats on component mount
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/flatadmin/owner`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFlats(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFlats();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flat?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/flatadmin/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFlats(flats.filter((flat) => flat._id !== id));
    } catch (error) {
      console.error("Error deleting flat:", error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching flats: {error}</p>;

  return (
    <section className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Your Flats</h2>
      {flats.length === 0 ? (
        <p>No flats found.</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Developer</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat._id} className="border-t">
                <td className="p-3">{flat.name}</td>
                <td className="p-3">{flat.developer}</td>
                <td className="p-3">{flat.price}</td>
                <td className="p-3">
                  <button
                    onClick={() => onEdit(flat)}
                    className="text-blue-500 mx-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(flat._id)}
                    className="text-red-500 mx-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default FlatList;
