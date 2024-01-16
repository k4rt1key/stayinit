import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from "@material-tailwind/react";

export default function Home() {

    return (
        < div className='flex flex-col gap-10 h-full justify-center items-center bg-[#FFFBF2]' >
            {/* hero section */}
            <div className='md:w-[40rem] w-[20rem] flex flex-col gap-10'>
                {/* search */}
                < div className='flex flex-col gap-10'>
                    <h1 className='text-4xl font-Classy'>Search most value for money flats and hostels</h1>
                    {/* <form action="" className='flex flex-row gap-4'>
                        <Input size="lg" className='rounded-[3rem] ' label="Search" />
                        <button className="rounded-[4rem] text-white px-5 py-3 bg-colorG"> Search </button>
                    </form > */}
                </div >
                {/* flats and hostels */}
                < div className='flex flex-col gap-10' >
                    <h1 className='text-4xl'>Explore our flats and hostels</h1>
                    <div className='flex flex-row gap-4'>
                        <Link to="/flats" className="rounded-[4rem] text-white px-5 py-3 bg-colorG">Flats</Link>
                        <Link to="/hostels" className="rounded-[4rem] text-white px-5 py-3 bg-colorG">Hostels</Link>
                    </div>
                </div >
            </div >
        </div >

    );
};

