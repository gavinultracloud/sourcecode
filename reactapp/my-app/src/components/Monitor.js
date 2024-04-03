import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Monitor = () => {
    const [pullRequests, setPullRequests] = useState([]);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Check if user is not authenticated
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login page
            return;
        }

        // Define the fetch function
        const fetchPullRequests = async () => {
            try {
                const response = await fetch('/API/pull_request_logs');
                const data = await response.json();
                setPullRequests(data);
            } catch (error) {
                console.error('Failed to fetch pull requests:', error);
            }
        };

        fetchPullRequests();
    }, [isAuthenticated, navigate]); 


    return (
        <div className="container mt-5">
            <h2>GitHub Pull Requests Monitor</h2>
            <br></br>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Event Type</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Pull Request ID</th>
                        <th>Pull Request URL</th>
                        <th>Screenshot</th>
                        <th>Received At</th>
                    </tr>
                </thead>
                <tbody>
                    {pullRequests.map((pr) => (
                        <tr key={pr.id}>
                            <td>{pr.id}</td>
                            <td>{pr.event_type}</td>
                            <td>{pr.title}</td>
                            <td>{pr.state}</td>
                            <td>{pr.pull_request_id}</td>
                            <td><a href={pr.pull_request_url} target="_blank" rel="noopener noreferrer">View Pull Request</a></td>
                            <td>
                                <img src={`http://localhost:5000/screenshots/${pr.screenshot_path.split('/').pop()}`} alt="Screenshot" />
                            </td>
                            <td>{pr.received_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br></br>
            <br></br>
        </div>
    );
};

export default Monitor;