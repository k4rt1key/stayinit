import { Carousel } from "@material-tailwind/react";

export default function ImageCarousel({ arrayOfImages }) {
    const images = arrayOfImages && arrayOfImages.length > 0 ?
        arrayOfImages.map((image) => {
            return (
                <img src={image.url} className="h-full w-full object-cover" alt="propery images" lazy='true' />
            )
        }) : []

    return (

        <div className=" p-6 ">
            <Carousel className="rounded-xl h-[300px] md:h-[400px] lg:h-[500px] ">
                {images}
            </Carousel>
        </div>
    )
}