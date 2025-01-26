import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <Header customStyleOverlay={true} />
      <main className="privacy-content">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-date">
          <strong>Effective Date:</strong> 19.01.2025 <br />
          <strong>Last Updated:</strong> 19.01.2025
        </p>
        <section className="privacy-section">
          <h2>1. Information We Collect</h2>
          <p>
            We may collect the following types of information when you use the
            Service:
          </p>
          <ul className="privacy-list">
            <li>Personal Information: Name, email address, etc.</li>
            <li>Usage Data: Activity such as IP address, browser type, etc.</li>
          </ul>
        </section>
        <section className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul className="privacy-list">
            <li>Provide, maintain, and improve the Service.</li>
            <li>Personalize the experience and communicate updates or inquiries.</li>
            <li>Analyze user activity and improve our features.</li>
          </ul>
        </section>
        <section className="privacy-section">
          <h2>3. Sharing of Information</h2>
          <p>
            We do not sell your information. However, we may share it with:
          </p>
          <ul className="privacy-list">
            <li>
              Service providers who help us operate or improve the Service.
            </li>
            <li>Law enforcement or other entities when required by law.</li>
          </ul>
        </section>
        <section className="privacy-section">
          <h2>4. Data Security</h2>
          <p>
            We take reasonable steps, including encryption and secure servers,
            to protect your data but cannot guarantee absolute security.
          </p>
        </section>
        <section className="privacy-section">
          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data.
            You can request these actions by contacting us at{" "}
            <a href="mailto:[Insert Email Address]">[Insert Email Address]</a>.
          </p>
        </section>
        <section className="privacy-section">
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Continued use of the
            Service constitutes acceptance of the changes. If we make any
            significant changes, we will notify you via email or through the
            Service.
          </p>
        </section>
        <section className="privacy-section">
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy,
            please contact us at <a href="mailto:[Insert Email Address]">[Insert Email Address]</a>.
          </p>
        </section>
      </main>
      <Footer customStyle={true} />
    </div>
  );
}
