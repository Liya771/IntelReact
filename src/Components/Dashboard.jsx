import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/protected', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                console.error("Error fetching protected data:", error);
                navigate('/');
            }
        };

        fetchProtectedData();
    }, [navigate]);

    const handleLogout = async () => {
        await fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' });
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome to the Dashboard</h2>
            <p>{message}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
