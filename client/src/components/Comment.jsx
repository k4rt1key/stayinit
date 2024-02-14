import React from "react";

export default function Comment({ comment, profile, createdAt, rating, id }) {
  return (
    <div className="w-full shadow-sm shadow-deep-orange-50">
      <div className="flex flex-col gap-2 overflow-y-scroll no-scrollbar w-full">
        <div className="">
          {/* Username & CommentedAt */}
          <div className="flex flex-row gap-4 text-xl w-full">
            {/* example ( 5 (STAR) Rating ) */}
            <span className="">{profile?.username}</span>

            <span className="text-md flex flex-row justify-center item-center gap-1">
              {rating}{" "}
              <img
                src="/icons/yellow-star.png"
                className="w-6 h-6 inline"
                alt=""
              />
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <p className="text-md">{comment}</p>
        </div>
      </div>
    </div>
  );
}
