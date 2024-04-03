import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    const navigateToMonitor = () => {
        navigate('/monitor');
    };

    return (
        <div className="container mt-5 text-center">
            <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" className="mb-4" style={{ maxWidth: '150px' }} />
            <h1 className="mb-3">Welcome To AudITech GitHub Monitor Demo</h1>
            <br></br>
            <p>As part of the demonstration, You are required to login to view the GitHub Monitor, Please contact Gavin for login credentials.</p>
            <br></br>
            {/* Login and Register Buttons */}
            <div className="mt-4">
                <button onClick={navigateToLogin} className="btn btn-primary me-2">Login</button>
                <button onClick={navigateToRegister} className="btn btn-secondary">Register</button>
            </div>
            <br></br>
            <p className="mt-4">View our GitHub Integration Monitor - If not logged in you will be directed to Login Page.</p>
            <br></br>
            <div className="mt-4">
                <button onClick={navigateToMonitor} className="btn btn-primary me-2">GitHub Monitor</button>
            </div>
            <br></br>
            <br></br>
            <img src={`${process.env.PUBLIC_URL}/dashboard.gif`} alt="Dashboard Preview" style={{ width: '100%', height: 'auto' }} />
            <br></br>
            <br></br>
            <p className="mt-4">Sample data and place holder that Gavin decided to put here, so that the website doesn't look so empty.</p>
            <br></br>
            <br></br>
        </div>
    );
};

export default Welcome;
