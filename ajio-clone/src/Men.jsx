import React from "react";
import { Carousel } from "react-responsive-carousel";

function Men() {
  const images = [
      {
          src: "/assets/img5.jpg",
          alt: "Image 1"
      },
      {
          src: "/assets/img6.jpg",
          alt: "Image 2"
      },
      {
          src: "/assets/img4.jpg",
          alt: "Image 3"
      }
  ];

  return (
    <div className="section">
      <h1 style={{ textAlign: "center" }}>Men's page</h1>

      <Carousel
        className="rounded-xl"
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
      >
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Men;