import React, { useState, useEffect } from "react";
import OwnedFlats from "./YourFlats";
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

  if (!isAuthenticate) {
    // return navigate("/login?returnUrl=/dashboard/flatlist");
  }

  return (
    <div className="flex gap-10 px-[1.5rem] lg:px-[10rem] py-[2rem]">
      <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center p-6 w-[97%] rounded-2xl bg-gray-100">
        <h1 className="text-lg md:text-3xl text-center font-1">
          Your Flats
        </h1>
      </div>
        <OwnedFlats flats={flats} setFlats={setFlats} />
      </div>
    </div>
  );
};

export default FlatManager;
