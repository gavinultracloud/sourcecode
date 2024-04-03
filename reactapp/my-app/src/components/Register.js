import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // For success messages
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!firstName || !surname || !emailAddress || !cellPhone || !password) {
            setError('Please fill in all fields.');
            return;
        }

        // Resetting messages
        setError('');
        setMessage('');

        try {
            const response = await fetch('/API/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, surname, emailAddress, cellPhone, password }), 
            });
    
            const data = await response.json();
    
            if (response.ok && data.message === "User registered successfully") {
                setMessage(data.message); // Display success message
                // Optionally reset form fields here if you wish
            } else {
                setError(data.error || 'Registration failed, please try again.');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Registration failed, please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container mt-5 text-center">
            <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" className="mb-4" style={{ maxWidth: '150px' }} />
            <h1 className="mb-3">User Account Registration</h1>
            <br></br>
            <p>Please provide details for each of the following fields, then click Register</p>
            <br></br>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {message && <div className="alert alert-success" role="alert">{message}</div>}
            {/* Form and form fields here */}
            <form onSubmit={handleRegister} className="d-flex justify-content-center">
                <div style={{ maxWidth: '500px', width: '100%' }} className="d-grid gap-2 d-md-block position-relative">
                    <div className="form-floating mb-3 text-start">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="firstName" 
                            placeholder="Joe"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)} />
                        <label htmlFor="firstName">First Name</label>
                    </div>
                    <div className="form-floating mb-3 text-start">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="surname" 
                            placeholder="Soap"
                            value={surname}
                            onChange={e => setSurname(e.target.value)} />
                        <label htmlFor="surname">Surname</label>
                    </div>
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
                            type="text" 
                            className="form-control" 
                            id="cellPhone" 
                            placeholder="082 000 8888"
                            value={cellPhone}
                            onChange={e => setCellPhone(e.target.value)} />
                        <label htmlFor="cellPhone">Cell Phone Number</label>
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
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                    <br></br>
                    <br></br>
                </div>
            </form>
            <img src={`${process.env.PUBLIC_URL}/dashboard4.gif`} alt="Dashboard Preview" style={{ width: '100%', height: 'auto' }} />
            <br></br>
        </div>
    );
};

export default Register;
