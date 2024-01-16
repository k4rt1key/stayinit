import React from "react"

// FlatInfoCard component...
// Example...

// Sqft    1200
// Floor   7
// ...

export default function FlatInfoCard({ property, value }) {
    return (

        <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
            <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">{property}</div>
            <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                <span className="font-bold">{value}</span>
            </div>
        </div>

    )
}