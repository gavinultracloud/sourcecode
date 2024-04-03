import React from 'react';
import { useNavigate } from 'react-router-dom';

const SourceCode = () => {
    const navigate = useNavigate();


    return (
        <div className="container mt-5 text-center">
            <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" className="mb-4" style={{ maxWidth: '150px' }} />
            <h1 className="mb-3">Source Code</h1>
            <br></br>
            <p>To whom it may concern, we are pretty awesome.... Space holder.</p>

            <br></br>
            <p className="mt-4">The future of repository monitoring and auditing is here.</p>
            <br></br>
            
            {/* Add the GIF image just above the footer */}
            <img src={`${process.env.PUBLIC_URL}/dashboard2.gif`} alt="Dashboard Preview" style={{ width: '100%', height: 'auto' }} />
            <br></br>
            <p className="mt-4">This is probably just a placeholder, but Gavin may very well use this space to brag about his excellent technical skills, but only time will tell.</p>
            <br></br>
        </div>
    );
};

export default SourceCode;
