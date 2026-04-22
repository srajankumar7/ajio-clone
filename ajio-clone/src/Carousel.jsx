import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
export default function CarouselComponent() {
    const images = [
        {
            src: "/assets/img1.jpg",
            alt: "Image 1"
        },
        {
            src: "/assets/img2.jpg",
            alt: "Image 2"
        },
        {
            src: "/assets/img3.jpg",
            alt: "Image 3"
        },
        {
            src: "/assets/img4.jpg",
            alt: "Image 4"  
        },
        {
            src: "/assets/img5.jpg",
            alt: "Image 5"
        },
        {
            src: "/assets/img6.jpg",
            alt: "Image 6"
        },
    ];
    const images2 = [
        {
            src: "/assets/w1.jpg",
            alt: "Image 1"
        },
        {
            src: "/assets/w2.jpg",
            alt: "Image 2"
        },
        {
            src: "/assets/w4.jpg",
            alt: "Image 3"
        }
    ];

    return (
        <div className='section' >
            <h1>Trending offers</h1><br /> 
            <Carousel classname="rounded-xl"autoPlay infiniteLoop interval={2000}
                showArrows showThumbs={false} showStatus={false} showIndicators={true}>
                {
                    images.map(image => (
                    <img  src={image.src} alt={image.alt} />
                ))}     
            </Carousel><br /><br />
            <h1 style={{ textAlign: "center" }}>Top-Tier Fashions</h1><br /><br />
            <Carousel classname="rounded-xl"autoPlay infiniteLoop interval={2000}
                showArrows showThumbs={false} showStatus={false} showIndicators={true}>
                {
                    images2.map(image => (
                    <img  src={image.src} alt={image.alt} />
                ))}     
            </Carousel>
            
        </div>
        
    );
    
}
