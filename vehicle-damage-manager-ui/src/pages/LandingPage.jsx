import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features'; // Import nou
import Footer from '../components/layout/Footer'; // Il vom crea imediat

const LandingPage = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </>
    );
};

export default LandingPage;