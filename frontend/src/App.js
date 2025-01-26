import React from 'react';
import { Routes, Route,} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Cabinet from './pages/Cabinet';
import PrivateRoute from './components/PrivateRoute';
import VerifyWaiting from './pages/VerifyWaiting';

import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-waiting" element={<VerifyWaiting />} />
        <Route path="/verify" element={<VerifyEmail/>} />
        {/* Protected Routes */}
        <Route
          path="/cabinet"
          element={
            <PrivateRoute>
              <Cabinet />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-center" autoClose={false} hideProgressBar={true} closeButton={true} />
    </div>
  );
};

export default App;