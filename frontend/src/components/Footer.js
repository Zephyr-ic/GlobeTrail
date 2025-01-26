import React, { useEffect } from "react";
import "./Footer.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from '../assets/logo-footer.png';

const Footer = ({customStyle=false}) => {


  useEffect(() => {
    // Get references to footer and trigger area
    const footer = document.querySelector('.footer');
    const footerTrigger = document.querySelector('.footer-trigger');

    // Show the footer when the mouse enters the footer-trigger area
    footerTrigger.addEventListener('mouseenter', () => {
      footer.classList.add('show');
    });

    // Show the footer when mouse enters the footer itself
    footer.addEventListener('mouseenter', () => {
      footer.classList.add('show');
    });

    // Hide the footer when mouse leaves the footer and trigger area
    const hideFooter = () => {
      footer.classList.remove('show');
    };
    
    // Mouse leave on the trigger area and footer
    footerTrigger.addEventListener('mouseleave', hideFooter);
    footer.addEventListener('mouseleave', hideFooter);
    
    return () => {
      // Clean up the event listeners when the component is unmounted
      footerTrigger.removeEventListener('mouseenter', () => {
        footer.classList.add('show');
      });
      footer.removeEventListener('mouseenter', () => {
        footer.classList.add('show');
      });
      footerTrigger.removeEventListener('mouseleave', hideFooter);
      footer.removeEventListener('mouseleave', hideFooter);
    };
  }, []);
  
  return (
    <>
      <div className={`footer-trigger ${customStyle ? 'custom-style' : ''}`}></div>
      <footer className="footer">
        <p><b>Design &copy; 2024</b></p>
        <div className="footer-info-container">
          <div className="footer-info">
            <p><b>Backend:</b> Node, Express</p> 
            <p><b>Frontend:</b> React</p>
            <p>Denis Lubnin | Aleksand Gurov </p>
            <p>
              
              <Link to="/about"><b>About</b></Link> this app
            </p>
            <p>
              <b>Contact us: </b>
              <Link to="/contact">globetrail@gmail.com</Link>
            </p>
          </div>
          <img className="footer-logo" src={logo} alt="Footer logo" />
        </div>
        <p>
          
          <Link to="/terms-of-use"><b>Terms of use</b></Link> |{" "} 
          <Link to="/privacy-policy"><b>Privacy policy</b></Link>
        </p>
        <p><b>Powered by: </b> Google Maps API | Google Translate API</p>
      </footer>
    </>
  );
};

export default Footer;