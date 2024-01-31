import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../../contexts/Auth"
import { getFirstImage } from "../../utils/utilityFunctions";
import { Spinner } from "@material-tailwind/react";
import Pricing from "./Pricing"

export default function Card({ hostel }) {

    const priceAndSharingDivArray = Array.isArray(hostel.priceAndSharing) ?
        hostel.priceAndSharing.map((x, i) => {
            return (
                <Pricing key={i} price={x.price} sharing={x.sharing} />
            )
        }) : []


    const { authData } = useAuth()
    const { isAuthenticate, profile } = authData;

    const [likedProperty, setLikedProperty] = useState([])
    const [likesLength, setLikesLength] = useState(() => likedProperty.length)
    const [likeLoading, setLikeLoading] = useState(false)



    async function getLikes() {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }

            const response = await fetch(`http://localhost:5000/api/v1/likes`, requestOptions);
            const jsonResponse = await response.json();
            const data = jsonResponse.data;

            if (jsonResponse.success === true) {

                const newList = []
                data.forEach((like) => {
                    like.hostel ? newList.push(like.hostel._id) : null
                })

                setLikedProperty(newList)

            }

        } catch (error) {
            throw new Error(error.message)
        }
    }

    React.useEffect(() => {
        if (isAuthenticate) {
            setLikeLoading(true)
            getLikes()
            setLikeLoading(false)
        }
    }, [likesLength])

    function toggleLike() {
        if (isAuthenticate) {
            if (likedProperty.includes(hostel._id)) {
                unlike()
            } else {
                like()
            }
        }
    }

    async function unlike() {
        if (isAuthenticate) {

            const responseOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }

            setLikeLoading(true)
            const response = await fetch(`http://localhost:5000/api/v1/likes/hostel/${hostel._id}`, responseOptions);
            const jsonResponse = await response.json();
            setLikeLoading(false)

            if (jsonResponse.success === true) {
                setLikedProperty(() => {
                    return (likedProperty.filter((property) => {
                        return property !== hostel._id;
                    }))
                })

                setLikesLength((prev) => {
                    return prev - 1
                })
            }

        }
    }

    async function like() {
        if (isAuthenticate) {

            const bodyData = {
                "propertyId": hostel._id,
                "type": "hostel"
            }

            const requestObject = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(bodyData)
            }


            setLikeLoading(true)
            const response = await fetch(`http://localhost:5000/api/v1/likes`, requestObject);
            const jsonResponse = await response.json();
            setLikeLoading(false)

            if (jsonResponse.success === true) {

                setLikedProperty((prev) => {
                    const newList = [...prev]
                    newList.push(hostel._id)
                    return newList
                })

                setLikesLength((prev) => {
                    return prev + 1
                })

            }
        }
    }

    return (

        <section className="cursor-pointer flex flex-col items-center py-2 px-4 my-2 min-w-[80%] md:px-[6rem] ">
            <div className="flex flex-col w-full items-center">
                <div className="shadow-lg px-[4rem] py-4 rounded-lg">

                    {/* Title & Like Icon */}
                    <div className="flex flex-row lg:justify-between justify-center gap-5 w-full max-w-[50rem]">
                        {/* Titile */}
                        <div className="w-[90%] flex flex-col gap-3 items-start py-4">
                            <h1 className="leading-3 text-xl">
                                {hostel.name}
                            </h1>
                            <p className="leading-3 text-sm">
                                {hostel.locality}, {hostel.city}
                            </p>
                        </div>
                        {/* Like icon */}
                        {isAuthenticate ?
                            <div className="w-[2rem] flex justify-center items-center">
                                {likeLoading ?
                                    <Spinner color="white" size="sm" />
                                    :
                                    <img src={likedProperty.includes(hostel._id) ? `/icons/red-heart.png` : `/icons/heart.png`} onClick={toggleLike} alt="" />
                                }
                            </div> : null}

                    </div>

                    {/* Photo And Pricing Big Div */}
                    <div className="w-full max-w-[50rem] h-full flex lg:flex-row gap-10 items-center lg:items-start flex-col relative">

                        {/* Hostel Image */}
                        <div className="flex lg:items-start lg:justify-start flex-col min-w-[200px] min-h-[112px] max-h-[50.6%] max-w-[90%]">
                            <img loading="lazy" src={getFirstImage(hostel)} className="rounded-lg object-cover lg:w-[500px] lg:h-[281px] w-auto h-auto" />
                        </div>


                        {/* Pricing */}
                        <div className="flex items-center justify-center lg:items-end lg:justify-end flex-col w-[100%] lg:w-[60%]">
                            <div className="flex justify-center flex-col w-full h-auto min-w-[200px] max-w-[90%]">
                                <div className="text-teal-950 text-xs leading-3 tracking-wide self-start whitespace-nowrap">
                                    <h3>
                                        <a href="" rel="noopener noreferrer" target="_blank">
                                            ROOM Sharing &amp; RENT
                                        </a>
                                    </h3>
                                </div>

                                {priceAndSharingDivArray}

                                <Link to={`./${hostel.uniqueName}`} rel="noopener noreferrer">
                                    <div className="lg:absolute bottom-0 right-0 bg-colorG text-[#FFFBF2] px-4 py-4 rounded-[1rem] md-down: my-5">
                                        <div className="text-base leading-6 self-center whitespace-nowrap">
                                            See what’s available
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </section>
    );
}

