import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
    const { isAuthenticated, userDetails, logout } = useAuth();
    const navigate = useNavigate(); // Use the useNavigate hook

    const handleLogout = () => {
        logout(); // Perform logout operation from AuthContext
        navigate('/logged-out', { replace: true }); // Redirect to logged-out page
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" style={{ maxHeight: '50px' }} />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/about-us">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/products-services">Products & Services</Link>
                        </li>
                        {/* My Dashboard Dropdown */}
                        <li className="nav-item dropdown">
                            <a className="nav-link nav-link-custom dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                My Dashboard
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                {!isAuthenticated ? (
                                    <>
                                        <li><Link className="dropdown-item dropdown-item-custom" to="/login">Login</Link></li>
                                        <li><Link className="dropdown-item dropdown-item-custom" to="/register">Register</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><button className="dropdown-item dropdown-item-custom" onClick={handleLogout}>Logout</button></li> {/* Use handleLogout for the click event */}
                                        <li><Link className="dropdown-item dropdown-item-custom" to="/monitor">Monitor GitHub</Link></li>
                                        <li><Link className="dropdown-item dropdown-item-custom" to="/my-account">My Account</Link></li>
                                    </>
                                )}
                            </ul>
                        </li>
                    </ul>
                    {isAuthenticated && userDetails && (
                        <div className="navbar-nav">
                            Welcome back, {userDetails.firstName || 'User'}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
