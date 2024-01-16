import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom";

import Pricing from "../components/Hostel/Pricing";
import AminitesText from "../components/Hostel/AminitiesText";
import ImageCarousel from "../components/ImageCarousel";
import CommentsDiv from "../components/CommentsDiv";
import NearestLandmarks from "../components/NearestLandmarks";

export default function HostelInfo() {

    const navigate = useNavigate()

    const { id } = useParams();

    const [hostel, setHostel] = useState({})
    const [loading, setLoading] = useState(false)
    const [commentsLength, setCommentsLength] = useState(0);


    async function fetchHostelInfo() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await fetch(`http://localhost:5000/api/v1/hostel/${id}`, requestOptions);
        const jsonResponse = await response.json();

        if (jsonResponse.success === true) {
            setHostel(jsonResponse.data);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchHostelInfo()
        setLoading(false)
    }, [commentsLength])


    // Getting All Attributes from Hostel
    const {
        _id,
        name,
        priceAndSharing,
        forWhichGender,
        addressLink,
        address,
        locality,
        city,
        pincode,
        contactNumber,
        contactEmail,
        addedBy,
        nearestLandmarks,
        comments,
        likes,
        arrayOfImages,
        description,
        liftFacility,
        wifiFacility,
        gymFacility,
        acFacility,
        gamingRoom,
        freeLaundry,
        securityGuard,
        filterWater,
        cctv,
        cleaning,
    } = hostel


    // Creating Aminities Div
    const aminitesArr = []

    if (acFacility === true) {
        aminitesArr.push(<AminitesText url={"ac.png"} name={"Air Conditioner"} />)
    }
    if (liftFacility === true) {
        aminitesArr.push(<AminitesText url={"lift.png"} name={"Lift Avilable"} />)
    }
    if (wifiFacility === true) {
        aminitesArr.push(<AminitesText url={"wifi.png"} name={"Free Wifi"} />)
    }
    if (gymFacility === true) {
        aminitesArr.push(<AminitesText url={"gym.png"} name={"Gym Facility"} />)
    }
    if (freeLaundry === true) {
        aminitesArr.push(<AminitesText url={"laundry.png"} name={"Free Laundry"} />)
    }
    if (cctv === true) {
        aminitesArr.push(<AminitesText url={"cctv.png"} name={"CCTV"} />)
    }
    if (cleaning === true) {
        aminitesArr.push(<AminitesText url={"cleaning.png"} name={"Room Cleaning"} />)
    }
    if (securityGuard === true) {
        aminitesArr.push(<AminitesText url={"security.png"} name={"Security Guard"} />)
    }
    if (filterWater === true) {
        aminitesArr.push(<AminitesText url={"water.png"} name={"Water Filter"} />)
    }


    // Creating Pricing And Sharing Div
    const priceAndSharingDivArray = Array.isArray(priceAndSharing) ?
        priceAndSharing.map((x) => {
            return (
                <Pricing price={x.price} sharing={x.sharing} />
            )
        }) : []

    if (!loading) {
        return (
            <div className="lg:p-8 gap-5 flex flex-col items-center" >


                <div className="w-full">
                    <ImageCarousel arrayOfImages={arrayOfImages} />
                </div>

                <div className="w-full md-down: justify-items-center px-[2rem] grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

                    <div className="bg-colorY cursor-pointer rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex flex-col items-start w-full h-auto min-w-[300px] max-w-[600px] relative gap-4 no-scrollbar overflow-x-hidden">
                        <div className="flex flex-row flex-wrap gap-2 my-3 py-[0.5rem] px-10 w-full" >
                            {aminitesArr}
                        </div>
                    </div >

                    {/* Pricing */}
                    <div className=" cursor-pointer hover:bg-colorY2H rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex flex-col items-start w-full h-auto min-w-[300px] max-w-[600px] relative">
                        <div className=" text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                            <h3>
                                <a href="" rel="noopener noreferrer" target="_blank">
                                    ROOM BHK &amp; RENT
                                </a>
                            </h3>
                        </div>
                        <div className="flex-col items-start self-stretch flex w-full justify-between gap-5 mt-4">
                            {priceAndSharingDivArray}
                        </div>
                    </div>


                    {/* Contact Details */}
                    <div className=" cursor-pointer hover:bg-colorY2H rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex items-center flex-col w-full h-auto min-w-[300px] max-w-[600px]">
                        <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                            <h3>
                                <a href="" rel="noopener noreferrer" target="_blank">
                                    Contact Details
                                </a>
                            </h3>
                        </div>
                        <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
                            <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">Contact Number</div>
                            <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                                <span className="font-bold">{contactNumber}</span>
                            </div>
                        </div>
                        <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
                            <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">Mail</div>
                            <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                                <span className="font-bold">{contactEmail}</span>
                            </div>
                        </div>
                        <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
                            <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">Address</div>
                            <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                                <span className="font-bold">{address}</span>
                            </div>
                        </div>
                        <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
                            <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">Location URL</div>
                            <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                                <a href={addressLink} className="font-bold">View On GoogleMap</a>
                            </div>
                        </div>

                    </div>

                    {/* Description */}
                    <div className="cursor-pointer hover:bg-colorY2H p-6  flex rounded-[1rem] border shadow-sm border-[#F3EADC] flex-col w-full h-auto min-w-[300px] max-w-[600px]">
                        <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                            <h3>
                                <a href="" target="_blank">
                                    Description
                                </a>
                            </h3>
                        </div>
                        <p className="py-2 my-2">{description}</p>
                    </div>


                    {/* Nearest Landmarks */}
                    <NearestLandmarks />

                </div >

                {/* Comments */}
                <div className="p-6 w-full">
                    <CommentsDiv type="hostel" _id={_id} comments={comments} setCommentsLength={setCommentsLength} />
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col h-[100%] justify-center items-center">
                <img src="/gifs/Pacman.gif" alt="" width="25px" />
                <h1>Loading...</h1>
            </div>
        )
    }
}
