import React from "react";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth"; // Import custom auth hook

import "./Home.css";

import image1 from '../assets/Canyon.png';
import image2 from '../assets/Colosseum.png';
import image3 from '../assets/GoldenGates.png';
import image4 from '../assets/Mountains.png';
import image5 from '../assets/RedCanyon.png';
import image6 from '../assets/TatjMahal.png';

const Home = () => {
    const { isAuthenticated } = useAuth(); // Access auth state

    const images = [image1, image2, image3, image4, image5, image6];


    return (
        <div className="Home">
            {/* Pass props based on auth state */}
            <Header
                customStyleAuth={!isAuthenticated()} // Show auth buttons only if not authenticated
                customStyleOverlay={isAuthenticated()} // Show overlay button only if authenticated
            />
            <Carousel images={images} />
            <Footer />
        </div>
    );
};

export default Home;