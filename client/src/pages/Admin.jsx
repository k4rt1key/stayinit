import React from "react";
import { Link } from "react-router-dom";

export default function Admin() {

    return (
        <div className='flex flex-col gap-10 h-full justify-center items-center bg-[#FFFBF2]'>
            <h1 className='text-4xl font-Classy'>Admin Page</h1>

            {/* Admin Links */}
            <div className='flex flex-col gap-4'>
                <Link to="/admin/hostels" className='text-blue-500 underline'>Admin Hostel</Link>
                <Link to="/admin/flats" className='text-blue-500 underline'>Admin Flat</Link>
                <Link to="/admin/users" className='text-blue-500 underline'>Admin User</Link>
            </div>

            {/* Add more content or functionality for the admin page as needed */}
        </div>
    );

}