import React from 'react';
import { useAuth } from './AuthContext';

const MyAccount = () => {
    const { isAuthenticated, userDetails } = useAuth();

    if (!isAuthenticated || !userDetails) {
        return <div className="container mt-5 text-center">
            <h2>Please login to view your account details.</h2>
        </div>;
    }

    return (
        <div className="container mt-5 text-center">
            <img src={`${process.env.PUBLIC_URL}/AudITech.png`} alt="AudITech Logo" className="mb-4" style={{ maxWidth: '150px' }} />
            <h1 className="mb-3">Welcome back {userDetails.firstName} {userDetails.surname}</h1>
            <br></br>
            <p>My Account Dashboard allows you to update your account details.</p>
            <br></br>
            <div className="table-responsive">
                <table className="table">
                    <tbody>
                        <tr>
                            <th>First Name</th>
                            <td>{userDetails.firstName}</td>
                            <td><button className="btn btn-primary btn-sm">Change</button></td>
                        </tr>
                        <tr>
                            <th>Surname</th>
                            <td>{userDetails.surname}</td>
                            <td><button className="btn btn-primary btn-sm">Change</button></td>
                        </tr>
                        <tr>
                            <th>Email Address</th>
                            <td>{userDetails.emailAddress}</td>
                            <td><button className="btn btn-primary btn-sm">Change</button></td>
                        </tr>
                        <tr>
                            <th>Cell Phone</th>
                            <td>{userDetails.cellPhone}</td>
                            <td><button className="btn btn-primary btn-sm">Change</button></td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>********</td>
                            <td><button className="btn btn-primary btn-sm">Change</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br></br>
            <br></br>
            <br></br>
        </div>
    );
};

export default MyAccount;
