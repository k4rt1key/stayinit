import React from "react";

// FlatInfoCard component...
// Example...

// Sqft    1200
// Floor   7
// ...

export default function FlatInfoCard({ name, value, url }) {
  return (
    <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
      <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">
        {name}
      </div>
      <a
        target="_blank"
        href={url ? url : ""}
        className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap"
      >
        <span className="font-bold">{value}</span>
      </a>
    </div>
  );
}
