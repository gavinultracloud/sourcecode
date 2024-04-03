import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-light">
            <div className="container text-center">
                <span className="text-muted">
                    <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" style={{ width: '100px', verticalAlign: 'middle' }} />
                    {' Developed by '}
                    <Link to="/about-us">Gavin Vermaak</Link>
                    {' to showcase his skills'}
                </span>
            </div>
        </footer>
    );
};

export default Footer;
