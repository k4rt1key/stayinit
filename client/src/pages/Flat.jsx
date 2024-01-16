import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from '../contexts/Auth'
import { roundToNearestThousand } from "../utils/utilityFunctions";

import FlatInfoCard from "../components/Flat/FlatInfoCard";
import ImageCarousel from "../components/ImageCarousel";
import CommentsDiv from "../components/CommentsDiv";
import NearestLandmarks from "../components/NearestLandmarks";

export default function Flat() {

    const navigate = useNavigate()

    // states for "Authentication" and result of "Predicted Prices"
    const { authData } = useAuth()
    const [prediction, setPrediction] = useState()
    const { id } = useParams();

    const [flat, setFlat] = useState({})
    const [loading, setLoading] = useState(false)

    const [commentsLength, setCommentsLength] = useState(0);

    // function : to predict flat's price range based on flat's attributes
    async function fetchPrediction(flat) {
        if (authData.isAuthenticate) {
            const response = await fetch('http://localhost:8000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    property_sqft: flat.sqft,
                    property_bhk: flat.bhk,
                    developer: flat.developer.toLowerCase(),
                    property_city: flat.city.toLowerCase(),
                    property_locality: flat.locality.toLowerCase(),
                    is_furnished: flat.furnitureType.toLowerCase(),
                    property_project: "",
                    num_of_baths: flat.bathrooms,
                    bachelors_or_family: "bachelors",
                    floornumber: flat.atWhichFloor,
                    totalfloor: flat.totalfloor || flat.atWhichFloor,
                    property_pricenan: 0,
                    property_bhknan: 0,
                    property_sqftnan: 0,
                    num_of_bathsnan: 0,
                    floornumbernan: 0,
                    totalfloornan: 0
                }),
            });

            const data = await response.json()


            setPrediction(data.prediction)
        }
        else {
            navigate("/login")
        }
    }

    async function fetchFlatInfo() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };


        const response = await fetch(`http://localhost:5000/api/v1/flat/${id}`, requestOptions);
        const jsonResponse = await response.json();

        if (jsonResponse.success === true) {
            setFlat(jsonResponse.data);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchFlatInfo()
        setLoading(false)
    }, [commentsLength])

    const {
        _id, type, name, price, bhk, sqft, furnitureType,
        address, locality, city, pincode, addressLink,
        nearestLandmarks, contactNumber, contactEmail,
        addedBy, comments, likes, arrayOfImages, atWhichFloor,
        totalFloor, description, bathrooms, balconies, developer,
    } = flat


    // returning UI component
    if (!loading) {
        return (
            <div className="mt-4 gap-8 flex flex-col">

                <ImageCarousel arrayOfImages={arrayOfImages} />

                <div className="md-down: justify-items-center p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Flat Information */}
                    <div className=" cursor-pointer hover:bg-colorY2H rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex items-center flex-col w-full h-auto min-w-[300px] max-w-[600px]">
                        <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                            <h3>
                                <a href="" rel="noopener noreferrer" target="_blank">
                                    Flat Information
                                </a>
                            </h3>
                        </div>
                        <FlatInfoCard property={'Sqft'} value={sqft} />
                        <FlatInfoCard property={'Floor'} value={atWhichFloor} />
                        <FlatInfoCard property={'Balconies'} value={balconies} />
                        <FlatInfoCard property={'Furniture Type'} value={furnitureType} />
                        <FlatInfoCard property={'Num of Baths'} value={bathrooms} />
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

                    {/* Pricing */}
                    <div className=" cursor-pointer hover:bg-colorY2H rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex flex-col items-start w-full h-auto min-w-[300px] max-w-[600px] relative">
                        <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                            <h3>
                                <a href="" rel="noopener noreferrer" target="_blank">
                                    ROOM BHK &amp; RENT
                                </a>
                            </h3>
                        </div>
                        <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
                            <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">{bhk} BHK Room</div>
                            <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                                <span className="">from </span>
                                <span className="font-bold">&#8377; {price}</span>
                            </div>
                        </div>
                        {
                            prediction ?
                                (
                                    <div className='mt-6 bg-[#78e7ab] mb-6 rounded-[2rem] text-black py-2 px-4 focus:outline-none focus:shadow-outline'>
                                        {`Price Should be between ${roundToNearestThousand(prediction - (prediction * 0.07))} - ${roundToNearestThousand(prediction + (prediction * 0.07))} Rupees`}
                                    </div>
                                ) : (
                                    <button onClick={() => fetchPrediction(flat)} className="">
                                        <div className=" text-[#FFFBF2] bg-colorG px-3 py-3 md-down: my-5 rounded-[1rem]">
                                            <div className="text-base text-center leading-6 self-center whitespace-nowrap">
                                                See Expected Price
                                            </div>
                                        </div>
                                    </button>
                                )}
                    </div>

                    {/* Nearest Landmarks */}
                    <NearestLandmarks nearestLandmarks={nearestLandmarks} />


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

                </div>

                {/* Comments */}
                <div className="p-6 w-full">
                    <CommentsDiv type="flat" _id={_id} comments={comments} setCommentsLength={setCommentsLength} />
                </div>

            </div >
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
