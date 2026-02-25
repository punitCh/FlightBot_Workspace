import React, { useState } from 'react';
import Login from './components/Login';
import ChatWidget from './components/ChatWidget'; // We will create this file next
import './App.css'; 

function App() {
    const [user, setUser] = useState(null);
    const [flights, setFlights] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // 1. THE SEARCH LOGIC: Talking to the .NET Vault
    const handleSearch = async () => {
        try {
            console.log("Fetching flights from Vault...");
            const response = await fetch('http://127.0.0.1:5048/api/flights');
            const data = await response.json();
            console.log("Vault Data Received:", data);
            setFlights(data);
        } catch (error) {
            console.error("Connection to Vault failed:", error);
            alert("Check if Docker Vault container is running!");
        }
    };

    // GATEKEEPER: If no user, show Login
    if (!user) {
        return <Login onLoginSuccess={(userData) => setUser(userData)} />;
    }

    return (
        <div className="app-container">
            <header className="main-header">
                <div className="logo">SkyHigh</div>
                <nav className="top-nav">
                    <a href="#flights">Flights</a>
                    <a href="#hotels">Hotels</a>
                    <button 
                        onClick={() => setUser(null)} 
                        style={{background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontWeight: '700', marginLeft: '30px'}}
                    >
                        LOGOUT
                    </button>
                </nav>
            </header>

            <main className="main-content">
                <section className="hero-content">
                    <h1>Let's explore the world together.</h1>
                    <p>Welcome back, <strong>{user.username}</strong>! Your flight data is secure.</p>
                </section>

                <section className="glass-effect">
                    <div className="search-controls">
                        <div className="input-group">
                            <label>DEPARTURE DATE</label>
                            <input type="text" defaultValue="03/01/2026" />
                        </div>
                        <button className="search-btn" onClick={handleSearch}>🔍 Find Flights</button>
                    </div>
                </section>

                <section className="results-container">
                    <h2 className="results-title">Available Flights</h2>
                    <div className="results-grid">
                        {flights.length > 0 ? (
                            flights.map((f, index) => (
                                <div key={index} className="flight-card">
                                    <div className="card-top">
                                        <div className="city">
                                            {/* Supporting both .NET PascalCase and JSON camelCase */}
                                            <span className="code">{f.origin || f.Origin}</span>
                                        </div>
                                        <div className="flight-path"><div className="line"></div> ✈️ <div className="line"></div></div>
                                        <div className="city">
                                            <span className="code">{f.destination || f.Destination}</span>
                                        </div>
                                    </div>
                                    <div className="card-divider"></div>
                                    <div className="card-bottom">
                                        <div className="passenger-info">
                                            <small>Passenger</small>
                                            <strong>{f.passengerName || f.PassengerName}</strong>
                                        </div>
                                        <div className="status-badge green">{f.status || f.Status}</div>
                                    </div>
                                    <div style={{marginTop: '10px', fontSize: '0.8rem', color: '#888'}}>
                                        Ticket ID: {f.ticketId || f.TicketId}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results-card">
                                No flights loaded. Click "Find Flights" to sync with the Vault. 🗓️
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* 3. AI CHAT WIDGET */}
            <div className="chat-widget-container">
                <button className="chat-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
                    {isChatOpen ? '✖ Close' : '✨ Ask AI'}
                </button>
                {isChatOpen && <ChatWidget />}
            </div>
        </div>
    );
}

export default App;