import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from '../contexts/Auth'
import Comment from "./Comment"
import { Rating } from "@material-tailwind/react";

export default function CommentsDiv({ _id, type, comments, setCommentsLength, revalidator }) {

    // Get authentication data from the Auth context
    const { authData } = useAuth()
    const { profile, isAuthenticate } = authData

    const navigate = useNavigate()

    // user inputed rating and comment
    const [rating, setRating] = React.useState(0)
    const [comment, setComment] = useState("");

    async function handleCommentSubmit(event) {
        event.preventDefault()

        if (!isAuthenticate) {
            navigate(`/login?return-url=${window.location.pathname}`)
        }
        else {
            try {
                const response = await fetch('http://localhost:5000/api/v1/comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('token')}`
                    },

                    body: JSON.stringify({
                        rating,
                        comment,
                        type,
                        flat: type === "flat" ? _id : null,
                        hostel: type === "hostel" ? _id : null,
                    })
                })

                const jsonResponse = await response.json()

                if (jsonResponse.success === true) {
                    setComment("")
                    setRating(0)
                    setCommentsLength(prev => prev + 1)
                    revalidator.revalidate();
                } else {
                    console.error(jsonResponse.message)
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    function averageRating() {
        let sum = 0;
        comments?.map((singleComment) => {
            sum += singleComment.rating
        })

        return sum / comments?.length
    }


    return (
        <div className="md-down: justify-items-center grid grid-cols-1 lg:grid-cols-2 gap-8 relative ">
            <div className="cursor-pointer rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex items-center justify-center flex-col w-full gap-6 h-auto min-w-[300px] max-w-[600px]">

                {/* Avrage Rating */}
                <div className="flex text-lg flex-row gap-2">
                    <span>Average Rating of </span><span className="">{averageRating()}</span><span><img className="w-[1.5rem]" src="/icons/yellow-star.png" alt="" /></span>
                </div>
                <p>With Total : {comments?.length} Ratings </p>

                {/* User input to give rating and comment */}
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4 items-center justify-center">

                    <Rating value={rating} onChange={(value) => setRating(value)} />

                    <textarea
                        className="flex w-[20rem] rounded-[3rem] border-2 border-[#d5bf9f] hover:bg-colorY2H px-3 py-3 text-sm placeholder:text-[#073937] focus:outline-none"
                        placeholder="Enter your Review about this Flat/Hostel"
                        value={comment} name="comment" id="comment" onChange={(event) => setComment(event.target.value)} />

                    <button type="submit" className="text-xs bg-colorG text-[#FFFBF2] px-3 py-3 rounded-[3rem] w-full"> Submit your Review {profile ? " as " + profile.username : " ( Login to comment ) "}</button>
                </form>
            </div>

            {/* All Comments */}
            <div className="cursor-pointer rounded-[1rem] border shadow-sm border-[#F3EADC] p-6 flex items-center flex-col w-full h-[20rem] no-scrollbar overflow-y-scroll min-w-[300px] max-w-[600px]">
                <div className="flex flex-col gap-4 mt-[2rem]">
                    {comments ? comments.map((singleComment) => {
                        return (
                            <>
                                <Comment
                                    key={singleComment._id}
                                    id={singleComment._id}
                                    comment={singleComment.comment}
                                    rating={singleComment.rating}
                                    profile={singleComment.profile}
                                    createdAt={singleComment.createdAt}
                                />
                                <hr />
                            </>
                        )
                    }) : <></>}
                </div>
            </div>
        </div>
    )
}
