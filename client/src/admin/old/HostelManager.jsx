import React, { useState } from "react";
import HostelForm from "./HostelForm";
import HostelList from "./HostelList";

const HostelManager = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (hostel) => {
    setSelectedHostel(hostel);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedHostel(null);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <div className="w-full max-w-7xl flex flex-col md:flex-row rounded-lg gap-10 p-6 md:p-8">
        <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-8">
          <HostelForm
            selectedHostel={selectedHostel}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
      <div className="w-full md:w-2/3">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left text-gray-800 mb-6">
          Hostel Manager
        </h1>
        <HostelList onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default HostelManager;
