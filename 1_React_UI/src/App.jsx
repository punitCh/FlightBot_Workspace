import { useState } from 'react'
import './App.css'

function App() {
  const [searchDate, setSearchDate] = useState('2026-03-01');
  const [flightResults, setFlightResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    try {
      const response = await fetch(`http://localhost:5048/api/flights/date/${searchDate}`);
      if (response.ok) {
        const data = await response.json();
        setFlightResults(data);
      } else {
        setFlightResults([]); 
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlightResults([]);
    }
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi Ankit! I am your SkyHigh AI assistant. Need help finding a flight?' }
  ]);
  const [input, setInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, connection error.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* 🌟 NEW MODERN HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay">
          <header className="main-header">
            <div className="logo">✈️ SkyHigh</div>
            <nav className="top-nav">
              <a href="#">Flights</a>
              <a href="#">Hotels</a>
              <a href="#">Manage Booking</a>
            </nav>
          </header>
          
          <div className="hero-content">
            <h1>Let's explore the world together.</h1>
            <p>Find and book the best flights with our AI-powered assistant.</p>
          </div>
        </div>
      </section>

      {/* 🌟 MODERN FLOATING SEARCH BOX */}
      <main className="main-content">
        <div className="search-box glass-effect">
          <div className="search-controls">
            <div className="input-group">
              <label>Departure Date</label>
              <input 
                type="date" 
                value={searchDate} 
                onChange={(e) => setSearchDate(e.target.value)} 
              />
            </div>
            <button onClick={handleSearch} className="search-btn">
              🔍 Find Flights
            </button>
          </div>
        </div>

        {/* 🌟 UPGRADED TICKET CARDS */}
        {hasSearched && (
          <div className="results-container">
            <h2 className="results-title">Available Flights</h2>
            <div className="results-grid">
              {flightResults.length > 0 ? (
                flightResults.map((flight) => (
                  <div key={flight.ticketId} className="flight-card">
                    <div className="card-top">
                      <div className="city">
                        <span className="code">{flight.origin}</span>
                        <span className="time">{new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flight-path">
                        <div className="line"></div>
                        <span>✈️</span>
                        <div className="line"></div>
                      </div>
                      <div className="city">
                        <span className="code">{flight.destination}</span>
                        <span className="time">Arrival</span>
                      </div>
                    </div>
                    <div className="card-divider"></div>
                    <div className="card-bottom">
                      <div className="passenger-info">
                        <small>Passenger</small>
                        <strong>{flight.passengerName}</strong>
                      </div>
                      <div className="ticket-info">
                        <small>Flight No.</small>
                        <strong>{flight.ticketId}</strong>
                      </div>
                      <span className={`status-badge ${flight.status === 'On Time' ? 'green' : 'red'}`}>
                        {flight.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results-card">
                  <p>No flights found for this date. 📅 Try March 1st or March 5th, 2026.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CHAT WIDGET (Kept mostly the same, just polished) */}
      <div className="chat-widget-container">
        {isChatOpen && (
          <div className="chat-popup">
            <div className="chat-header">
              <div className="chat-title">
                <span className="bot-icon">🤖</span>
                <div>
                  <h3>SkyHigh AI</h3>
                  <small>Online</small>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsChatOpen(false)}>✖</button>
            </div>
            <div className="chat-window">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <div className="message-bubble">{msg.text}</div>
                </div>
              ))}
              {isChatLoading && <div className="message assistant"><div className="message-bubble">Thinking...</div></div>}
            </div>
            <div className="chat-input-area">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your flight..."
              />
              <button onClick={sendMessage} disabled={isChatLoading}>Send</button>
            </div>
          </div>
        )}
        
        {!isChatOpen && (
          <button className="chat-fab" onClick={() => setIsChatOpen(true)}>
            ✨ Ask AI
          </button>
        )}
      </div>
    </div>
  )
}

export default App