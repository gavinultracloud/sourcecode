import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoggedOut = () => {
    const navigate = useNavigate();

    // Function to navigate to the login page
    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="container mt-5 text-center">
            <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" className="mb-4" style={{ maxWidth: '150px' }} />
            <h1 className="mb-3">You Have Successfully Logged Out</h1>
            <br></br>
            <p>To login in again, click on the button below.</p>
            <br></br>
            {/* Login and Register Buttons */}
            <div className="mt-4">
                <button onClick={navigateToLogin} className="btn btn-primary me-2">Login</button>
            </div>
            <br></br>
            <p className="mt-4">Gavin placed sample text here as a space holder.</p>
            <br></br>
            
            {/* Add the GIF image just above the footer */}
            <img src={`${process.env.PUBLIC_URL}/dashboard.gif`} alt="Dashboard Preview" style={{ width: '100%', height: 'auto' }} />
            <br></br>
            <br></br>
            <p className="mt-4">This is probably just a placeholder, but Gavin may very well use this space to brag about his excellent technical skills, but only time will tell.</p>
            <br></br>
        </div>
    );
};

export default LoggedOut;
