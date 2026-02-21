import { useState } from 'react'
import './App.css'

function App() {
  // Store the conversation history
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your flight assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the UI immediately
    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call your Python FastAPI Telephone Line
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      // Add the AI's response to the UI
      setMessages((prev) => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      console.error("Error communicating with the agent:", error);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting to the server right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>✈️ Flight Ticket Assistant</h1>
      </header>
      
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="message assistant"><div className="message-bubble">Thinking...</div></div>}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about your flight (e.g., 'When is flight TX-101?')"
        />
        <button onClick={sendMessage} disabled={isLoading}>Send</button>
      </div>
    </div>
  )
}

export default App