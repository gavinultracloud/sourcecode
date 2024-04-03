import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useAuth } from './AuthContext'; // Assuming the path to your AuthContext

const Monitor = () => {
    const [pullRequests, setPullRequests] = useState([]);
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const { isAuthenticated } = useAuth(); // Destructure isAuthenticated from useAuth

    useEffect(() => {
        // Check if user is not authenticated
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login page
            return; // Return early to avoid running the rest of the effect
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

        // Call the fetch function immediately to load initial data
        fetchPullRequests();

        // Set up an interval to refresh data every 1 minute (60000 milliseconds)
        const intervalId = setInterval(fetchPullRequests, 60000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
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
                                {/* Make sure to update the image src to use the correct route for your screenshots */}
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
