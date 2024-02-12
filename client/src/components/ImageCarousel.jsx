import { Carousel } from "@material-tailwind/react";
import { nanoid } from "nanoid";

export default function ImageCarousel({ arrayOfImages }) {
  const images =
    arrayOfImages && arrayOfImages.length > 0
      ? arrayOfImages.map((image) => {
          return (
            <img
              key={nanoid()}
              src={image.url}
              className="h-full w-full object-cover"
              alt="propery images"
              lazy="true"
            />
          );
        })
      : [];

  return (
    <div className="">
      <Carousel className="rounded-xl h-[300px] md:h-[400px] lg:h-[500px] ">
        {images}
      </Carousel>
    </div>
  );
}
