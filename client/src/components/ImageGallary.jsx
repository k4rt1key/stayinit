import React from "react";
import { Carousel, IconButton } from "@material-tailwind/react";

export default function ImageGallary({ images, imageClassName }) {
  const [active, setActive] = React.useState(images ? images[0] : "");

  React.useEffect(() => {
    setActive(images ? images[0] : "");
  }, [images]);

  return (
    <div className="w-full grid gap-4">
      <Carousel
        className="rounded-t-xl"
        autoplay={true}
        autoplayDelay={4000}
        loop={true}
        prevArrow={({ handlePrev }) => (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={handlePrev}
            className="!absolute top-2/4 left-4 -translate-y-2/4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={handleNext}
            className="!absolute top-2/4 !right-4 -translate-y-2/4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </IconButton>
        )}
      >
        {images?.map((imgelink, index) => (
          <div key={index}>
            <img src={imgelink} alt="image" className={imageClassName} />
          </div>
        ))}
      </Carousel>
    </div>
    // <div className="grid grid-cols-6 grid-rows-2 w-full border-2">
    //   <div className="col-span-4 row-span-4 w-full border-2">
    //     <img src={images[0]} alt="image" className="object-cover" />
    //   </div>
    //   <div className="col-span-2 row-span-1 w-[20%]">
    //     <img src={images[1]} alt="image" />
    //   </div>
    //   <div className="col-span-2 row-span-1 w-[20%]">
    //     <img src={images[2]} alt="image" />
    //   </div>
    // </div>
  );
}
