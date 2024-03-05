import React from "react";
export default function ImageGallary({ images }) {
  const [active, setActive] = React.useState(images ? images[0] : "");

  React.useEffect(() => {
    setActive(images ? images[0] : "");
  }, [images]);

  return (
    <div className="w-full grid gap-4">
      <div>
        <img
          className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
          src={active}
          alt=""
        />
      </div>
      <div className="w-full grid grid-cols-3 lg:grid-cols-8 gap-4">
        {images?.map((imgelink, index) => (
          <div key={index}>
            <img
              onClick={() => setActive(imgelink)}
              src={imgelink}
              className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
              alt="gallery-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
