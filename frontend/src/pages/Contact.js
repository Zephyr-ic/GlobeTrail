import React, { useState } from 'react';
import './Contact.css';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';


export default function Contact() {
  const { user } = useAuth(); // Get user information from the auth hook
  const [formData, setFormData] = useState({
    name: '',
    email: user ? user.email : '', // Automatically fill email if user is logged in
    subject: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/email/send-email', formData);
      alert('Your message has been sent!');
      setFormData({ name: '', email: user ? user.email : '', subject: '', message: '' }); // Reset the form
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send your message. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <Header customStyleOverlay={true}/>
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              style={{ width: '100%', padding: '8px' }}
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              style={{ width: '100%', padding: '8px' }}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="subject" style={{ display: 'block', marginBottom: '5px' }}>
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Subject"
              style={{ width: '100%', padding: '8px' }}
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>
              Describe Your Problem
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your problem here..."
              rows="5"
              style={{ width: '100%', padding: '8px' }}
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </form>
      </div>
      <Footer customStyle={true} />
    </div>
  );
}
