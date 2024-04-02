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
        className="rounded-xl"
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
  );

  // return (
  //   <div className="w-full grid gap-4">
  //     <div>
  //       <img
  //         className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
  //         src={active}
  //         alt=""
  //       />
  //     </div>
  //     <div className="w-full grid grid-cols-3 lg:grid-cols-8 gap-4">
  //       {images?.map((imgelink, index) => (
  //         <div key={index}>
  //           <img
  //             onClick={() => setActive(imgelink)}
  //             src={imgelink}
  //             className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
  //             alt="gallery-image"
  //           />
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
}
