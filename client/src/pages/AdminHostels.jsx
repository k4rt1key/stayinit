import { type } from "@testing-library/user-event/dist/type";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminHostels() {
  function handleTextInputChange(event) {}
  function handleCheckboxInputChange(event) {}

  const formFields = [
    {
      name: "name",
      type: "text",
      label: "Name",
      placeholder: "Name",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "developer",
      type: "text",
      label: "Developer",
      placeholder: "Developer",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "forWhichGender",
      type: "select",
      label: "For Which Gender",
      placeholder: "Select Gender",
      options: ["boys", "girls", "both"],
      onChange: (event) => {
        handleSelectInputChange(event);
      },
    },
    {
      name: "addressLink",
      type: "text",
      label: "Address Link",
      placeholder: "Address Link",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "address",
      type: "text",
      label: "Address",
      placeholder: "Address",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "locality",
      type: "text",
      label: "Locality",
      placeholder: "Locality",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "city",
      type: "text",
      label: "City",
      placeholder: "City",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "pincode",
      type: "text",
      label: "Pincode",
      placeholder: "Pincode",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "nearestLandmarks",
      type: "text",
      label: "Nearest Landmarks",
      placeholder: "Nearest Landmarks",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "contactNumber",
      type: "text",
      label: "Contact Number",
      placeholder: "Contact Number",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "contactEmail",
      type: "text",
      label: "Contact Email",
      placeholder: "Contact Email",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Description",
      onChange: (event) => {
        handleTextInputChange(event);
      },
    },
    {
      name: "liftFacility",
      type: "checkbox",
      label: "Lift Facility",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "wifiFacility",
      type: "checkbox",
      label: "Wifi Facility",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "gymFacility",
      type: "checkbox",
      label: "Gym Facility",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "acFacility",
      type: "checkbox",
      label: "AC Facility",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "gamingRoom",
      type: "checkbox",
      label: "Gaming Room",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "freeLaundry",
      type: "checkbox",
      label: "freeLaundry",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "securityGuard",
      type: "checkbox",
      label: "securityGuard",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "filterWater",
      type: "checkbox",
      label: "filterWater",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "cctv",
      type: "checkbox",
      label: "cctv",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
    {
      name: "cleaning",
      type: "checkbox",
      label: "cleaning",
      onChange: (event) => {
        handleCheckboxInputChange(event);
      },
    },
  ];

  const formFieldsDiv = formFields.map((x) => {
    return (
      <div>
        <label>
          {x.label}
          <input
            type={x.type}
            name={x.name}
            placeholder={x.placeholder}
            onChange={x.onChange}
          />
        </label>
      </div>
    );
  });

  return <form>{formFieldsDiv}</form>;
}
