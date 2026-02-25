import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // We use the 'vault' service name because they are on the same Docker network!
            const response = await fetch('http://127.0.0.1:5048/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, passwordHash: password }) 
            });

            if (response.ok) {
                const data = await response.json();
                onLoginSuccess(data);
            } else {
                setError('Invalid credentials. Try again.');
            }
        } catch (err) {
            setError('Cannot connect to the Vault.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h2>FlightBot Security Check</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <input 
                    type="text" placeholder="Username" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#0078d4', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Enter the FlightBot System
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;