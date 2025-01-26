import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyWaiting.css";
import EmpireStateBuilding from "../assets/EmpirestateBuilding.jpg"; // Import the image
import GreatWall from "../assets/GreatWall.jpg"; // Import the image

const VerifyWaiting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const eventSource = new EventSource(
      `http://localhost:5000/api/sse/check-verification-status?userId=${userId}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.isVerified) {
        localStorage.removeItem("userId");
        navigate("/cabinet");
      }
    };

    eventSource.onerror = () => {
      console.error("Error with the SSE connection");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [navigate]);

  return (
    <div className="wrapper">
      <div className="image-container">
        <img src={EmpireStateBuilding} alt="Empire State Building" className="left-image" />
        <div className="verify-waiting-container">
          <h2>Check Your Email</h2>
          <p>
            We've sent a verification link to your email address. 
            Please check your inbox and click the link to activate your account.
          </p>
          <p>
            Didn't receive the email? <a href="/resend-email">Click here to resend</a>
          </p>
        </div>
        <img src={GreatWall} alt="Great Wall" className="right-image" />
      </div>
    </div>
  );
};

export default VerifyWaiting;
