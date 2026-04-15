import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
function Kids() {
    const images = [
        {
            src: "src/assets/k1.jpg",
            alt: "Image 1"
        },
        {
            src: "src/assets/k2.jpg",
            alt: "Image 2"
        },
        {
            src: "src/assets/k3.jpg",
            alt: "Image 3"
        }];
    return (

        <div className='section' >
            <h1 style={{textAlign: "center"}}>Kids page</h1>
                            <Carousel classname="rounded-xl"autoPlay infiniteLoop interval={2000}
                                showArrows showThumbs={false} showStatus={false} showIndicators={true}>
                    {
                        images.map(image => (
                        <img  src={image.src} alt={image.alt} />
                    ))}     
                </Carousel>
            </div>
    );
}
export default Kids;