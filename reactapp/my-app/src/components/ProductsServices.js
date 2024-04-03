import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductsServices = () => {
    const navigate = useNavigate();

    const navigateToMonitor = () => {
        navigate('/monitor');
    };


    return (
        <div className="container mt-5 text-center">
            <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" className="mb-4" style={{ maxWidth: '150px' }} />
            <h1 className="mb-3">Products & Services</h1>
            <br></br>
            <p>To whom it may concern, we are pretty awesome.... Space holder.</p>

            <br></br>
            <p className="mt-4">The future of repository monitoring and auditing is here.</p>
            <br></br>
            <p className="mt-4">View our GitHub Integration Monitor - If not logged in you will be directed to Login Page.</p>
            <br></br>
            <div className="mt-4">
                <button onClick={navigateToMonitor} className="btn btn-primary me-2">GitHub Monitor</button>
            </div>
            <br></br>
            <br></br>
            <img src={`${process.env.PUBLIC_URL}/dashboard2.gif`} alt="Dashboard Preview" style={{ width: '100%', height: 'auto' }} />
            <br></br>
            <p className="mt-4">This is probably just a placeholder, but Gavin may very well use this space to brag about his excellent technical skills, but only time will tell.</p>
            <br></br>
        </div>
    );
};

export default ProductsServices;
