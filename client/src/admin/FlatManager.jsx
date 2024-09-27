import React, { useState, useEffect } from "react";
import OwnedFlats from "./YourFlats";
import addFlat from "../BackendUtils/addFlat";
import getFlats from "../BackendUtils/getFlats";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

const FlatManager = () => {
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [flats, setFlats] = useState([]);
  const [flat, setFlat] = useState({});
  const [rerender, setRerender] = useState(true);
  const { authData, loginContextFunction, logoutContextFunction } = useAuth();
  const { isAuthenticate, profile } = authData;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFlats() {
      const token = localStorage.getItem("token");
      const response = await getFlats(token);
      if (response.success) {
        setFlats(response.data);
      }
    }

    fetchFlats();
  }, [rerender]);

  function goBack() {
    setAddMode(false);
    setEditMode(false);
  }

  if (!isAuthenticate) {
    return navigate("/login?returnUrl=/dashboard/flatlist");
  }

  return (
    <div className="flex gap-10 px-[1.5rem] lg:px-[10rem] py-[2rem]">
      {addMode ? (
        <div>
          <button>New flat Form</button>
        </div>
      ) : editMode ? (
        <div>
          <button>Edit flat Form</button>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-4">
          <div className="font-1 text-3xl">Your Flats</div>
          <div className="flex w-full gap-8">
            <Link
              to="/dashboard/add-flat"
              className="bg-color2 font-1 py-3 px-4 w-full text-white"
            >
              + Add new flat
            </Link>
            <button className="bg-color2 font-1 py-3 px-4 w-full text-white">
              View Your Hostels
            </button>
          </div>
          <OwnedFlats flats={flats} />
        </div>
      )}
    </div>
  );
};

export default FlatManager;
