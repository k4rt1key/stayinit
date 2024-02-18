import { Carousel } from "@material-tailwind/react";
import { nanoid } from "nanoid";

export default function ImageCarousel({ images }) {
  const imagesArr =
    images && images.length > 0
      ? images.map((image) => {
          return (
            <img
              key={nanoid()}
              src={image}
              className="h-full w-full object-cover"
              alt="propery images"
              lazy="true"
            />
          );
        })
      : [];

  return (
    <div className="h-full w-full">
      <Carousel className="rounded-xl">{imagesArr}</Carousel>
    </div>
  );
}
