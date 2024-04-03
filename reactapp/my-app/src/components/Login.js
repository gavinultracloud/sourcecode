import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Email validation function
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Password validation function
    const isValidPassword = (password) => {
        return password.length >= 6;
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
    
        // Resetting error message
        setError('');
    
        // Validating email and password
        if (!isValidEmail(emailAddress)) {
            setError('Please enter a valid email address');
            return;
        }
    
        if (!isValidPassword(password)) {
            setError('Please enter a valid password');
            return;
        }
    
        // If both validations pass, proceed with the API call for login
        try {
            let loginResponse = await fetch('/API/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailAddress, password }), 
            });
            
            const loginData = await loginResponse.json();
            
            if (loginResponse.ok && loginData.loginState === "Login Successful") {
                // Fetch user details request
                let userDetailsResponse = await fetch('/API/get_user_details', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailAddress }), // Assuming emailAddress is sufficient for identifying the user
                });
    
                const userDetailsData = await userDetailsResponse.json();
    
                if (userDetailsResponse.ok) {
                    // Handle successful user details fetch
                    login(loginData.access_token, userDetailsData);
                    navigate('/my-account'); // Navigate to the account page after successful login and user details fetch
                } else {
                    throw new Error("Failed to fetch user details");
                }
            } else {
                setError(loginData.msg || 'Login failed, please try again.');
            }
        } catch (error) {
            console.error('Login process failed:', error);
            setError(error.message || 'Login process failed, please try again.');
        }
    };
    

    const handleRegister = () => {
        navigate('/register');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    return (
        <div className="container mt-5 text-center">
            <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" className="mb-4" style={{ maxWidth: '150px' }} />
            <h1 className="mb-3">User Account Login</h1>
            <br></br>
            <p>Please login with your registered E-mail Address and Password to access My Dashboard</p>
            <br></br>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleLogin} className="d-flex justify-content-center">
                <div style={{ maxWidth: '500px', width: '100%' }} className="d-grid gap-2 d-md-block position-relative">
                    <div className="form-floating mb-3 text-start">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="emailAddress" 
                            placeholder="joe_soap@gmail.com"
                            value={emailAddress}
                            onChange={e => setEmailAddress(e.target.value)} />
                        <label htmlFor="emailAddress">E-mail Address</label>
                    </div>
                    <div className="form-floating mb-3 text-start">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="form-control" 
                            id="password" 
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)} />
                        <label htmlFor="password">Password</label>
                        <i onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                            {showPassword ? '🙈' : '👁'}
                        </i>
                        <br></br>
                        <br></br>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <button type="button" onClick={handleRegister} className="btn btn-secondary ms-2">Register</button>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            </form>
            <img src={`${process.env.PUBLIC_URL}/dashboard4.gif`} alt="Dashboard Preview" style={{ width: '100%', height: 'auto' }} />
            <br></br>
        </div>
    );
};

export default Login;