import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import Comment from "./Comment";
import { Rating } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";

export default function CommentsDiv({
  _id,
  type,
  comments,
  setCommentsLength,
}) {
  // Get authentication data from the Auth context
  const { authData } = useAuth();
  const { profile, isAuthenticate } = authData;

  const navigate = useNavigate();

  // user inputed rating and comment
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!isAuthenticate) {
      navigate(`/login?return-url=${window.location.pathname}`);
    } else {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/v1/comment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          body: JSON.stringify({
            rating,
            comment,
            type,
            flat: type === "flat" ? _id : null,
            hostel: type === "hostel" ? _id : null,
          }),
        });

        const jsonResponse = await response.json();

        setLoading(false);
        if (jsonResponse.success === true) {
          toast.success(jsonResponse.message);
          setComment("Please Chnage the rating and comment to submit again");
          setCommentsLength((prev) => prev + 1);
        } else {
          toast.error(jsonResponse.message);
        }
      } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
    }
  }

  function averageRating() {
    let sum = 0;
    comments?.map((singleComment) => {
      sum += singleComment.rating;
    });

    return sum / comments?.length;
  }

  return (
    <div className="flex flex-col gap-10 border-2 shadow-sm rounded-lg border-[#F3EADC] p-6">
      {/* User input to give rating and comment */}
      <div className="flex flex-col gap-6">
        <span className="text-lg flex flex-row  gap-1">
          AverageRating of : {averageRating()}{" "}
          <img src="/icons/yellow-star.png" className="w-6 h-6 inline" alt="" />
        </span>
        <form
          onSubmit={handleCommentSubmit}
          className="flex flex-col md:flex-row gap-4"
        >
          <textarea
            type="text"
            className="flex w-[15rem] h-[5rem] rounded-[1rem] border-2 border-[#d5bf9f] hover:bg-colorY2H px-3 py-3 text-sm placeholder:text-[#073937] focus:outline-none"
            placeholder="Enter your Review about this Flat/Hostel"
            value={comment}
            name="comment"
            id="comment"
            onChange={(event) => setComment(event.target.value)}
          />
          <div className="flex flex-col gap-4">
            <Rating value={rating} onChange={(value) => setRating(value)} />
            <button
              type="submit"
              className="text-xs bg-colorG text-[#FFFBF2] px-3 py-3 rounded-[3rem] w-full"
            >
              {" "}
              Comment
            </button>
          </div>
        </form>
      </div>

      <div className="flex">
        <div className="min-h-[5rem] max-h-[15rem] w-[30rem] overflow-y-scroll no-scrollbar flex flex-col gap-5">
          {comments ? (
            comments.map((singleComment) => {
              return (
                <Comment
                  key={singleComment._id}
                  id={singleComment._id}
                  comment={singleComment.comment}
                  rating={singleComment.rating}
                  profile={singleComment.profile}
                  createdAt={singleComment.createdAt}
                />
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
