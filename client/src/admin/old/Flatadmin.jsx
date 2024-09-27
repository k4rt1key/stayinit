import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import FlatForm from "../FlatForm";
import LandingPageCardForOwner from "../../components/LandingPageCardForOwner";

const FlatManager = () => {
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  console.log(editMode);

  const fetchFlats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/flatadmin/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFlats(response.data.data);
    } catch (error) {
      console.error("Error fetching flats:", error);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const handleEdit = (flat) => {
    setSelectedFlat(flat);
    setIsFormOpen(true);
    setEditMode(true);
  };

  const handleDelete = async (flatId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/flatadmin/delete/${flatId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchFlats();
      } catch (error) {
        console.error("Error deleting property:", error.message);
      }
    }
  };

  const handleFormSuccess = () => {
    fetchFlats();
    setEditMode(false);
    setIsFormOpen(false);
    setSelectedFlat(null);
  };

  const landingPageCardPropList = flats.map((property) => {
    return {
      _id: property._id,
      images: property.images,
      city: property.city,
      locality: property.locality,
      uniqueName: property.uniqueName,
      name: property.name,
      price: property.price,
      bhk: property.bhk,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      balconies: property.balconies,
      type: "flat",
      handleEdit,
      handleDelete,
      handleFormSuccess,
    };
  });

  return (
    <div className="mt-10 container mx-auto gap-10">
      <div className="flex gap-8 flex-row ">
        <div className="rounded-lg gap-8 mb-8">
          <FlatForm
            flat={selectedFlat}
            editMode={editMode}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedFlat(null);
            }}
          />
        </div>

        <div className="flex flex-row flex-wrap w-full gap-6">
          {landingPageCardPropList.map((props, index) => (
            <React.Fragment key={`LandingPageCard${index}`}>
              <LandingPageCardForOwner
                className="flex flex-col md:h-auto items-start rounded-[1rem] w-[20rem] justify-start"
                {...props}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlatManager;
