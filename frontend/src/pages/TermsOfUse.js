import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./TermsOfUse.css";
import InactivityLogout from "../components/InactivityTimer";


const TermsOfUse = () => {

  
  return (
    <>
    <InactivityLogout timeoutDuration={1 * 60 * 1000} />
      <Header customStyleOverlay={true} />
      <div className="terms-container">
      <main className="terms-content">
        <h1 className="terms-title">Terms of Service</h1>
        <p className="terms-date">
          <strong>Effective Date:</strong> 19.01.2025 <br />
          <strong>Last Updated:</strong> 19.01.2025
        </p>
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>Globe Trail</strong> (the
            "Service"), you agree to these Terms of Service. If you do not
            agree, please do not use the Service.
          </p>
        </section>
        <section className="terms-section">
          <h2>2. Description of Service</h2>
          <p>
            <strong>Globe Trail</strong> is a platform designed to streamline your travel planning and itinerary management. The Service offers tools such as trip creation, itinerary organization, task tracking, and more to help users manage their journeys efficiently.
          </p>
        </section>
        <section className="terms-section">
          <h2>3. Use of Service</h2>
          <p>
            You are granted a limited, non-exclusive, non-transferable license
            to access and use the Service for personal or business purposes. You
            agree not to:
          </p>
          <ul className="terms-list">
            <li>Attempt to copy, modify, distribute, or reverse-engineer the Service.</li>
            <li>Use the Service in violation of any applicable laws or regulations.</li>
          </ul>
        </section>
        <section className="terms-section">
          <h2>4. Intellectual Property</h2>
          <p>
            All content and software on this Service, including but not limited to trademarks, logos, text, and underlying source code, are owned by <strong>Globe Trail</strong> or its licensors and are protected by copyright laws. The hosting infrastructure for this Service, provided via AWS EC2 or equivalent, does not transfer ownership or rights of the software or content to the hosting provider. All rights remain exclusively with Globe Trail.
          </p>
          <p>
            Certain parts of the Service may include third-party libraries or software licensed under separate terms, such as open-source licenses. Ownership of these components remains with their respective licensors, and their use is governed by applicable licensing agreements.
          </p>
        </section>
        <section className="terms-section">
          <h2>5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to the
            Service for violations of these terms or other misuse.
          </p>
        </section>
        <section className="terms-section">
          <h2>6. Disclaimer of Liability</h2>
          <p>
            The Service is provided "as is" without warranty of any kind.{" "}
            <strong>Globe Trail</strong> will not be liable for any damages,
            including data loss, interruptions, or any other issues arising from
            the use of the Service.
          </p>
        </section>
        <section className="terms-section">
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions or concerns about these terms or the Service, please contact us at: <br />
            <strong>Email:</strong> support@globetrail.com <br />
          </p>
        </section>
      </main>
      <Footer customStyle={true} />
    </div>
    </>
  );
}
export default TermsOfUse;