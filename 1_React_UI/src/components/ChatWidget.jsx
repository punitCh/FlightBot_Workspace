import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am the Flight Detective. How can I help you today?' }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages appear
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true); // Start the loading state

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            
            // Adding a small delay to make the transition smoother
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Detective is having trouble connecting. Please check if the Python agent and Ollama are running.' 
            }]);
        } finally {
            setIsThinking(false); // Stop the loading state
        }
    };

    return (
        <div className="chat-popup">
            <div className="chat-header">
                <div className="bot-icon">🤖</div>
                <div className="chat-title">
                    <h3>Flight Detective</h3>
                    <small style={{ color: '#4ade80' }}>● Online</small>
                </div>
            </div>

            <div className="chat-window">
                {messages.map((m, i) => (
                    <div key={i} className={`message-bubble ${m.role}`}>
                        {m.content}
                    </div>
                ))}
                
                {/* Thinking Spinner */}
                {isThinking && (
                    <div className="message-bubble assistant thinking">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && !isThinking && sendMessage()}
                    placeholder={isThinking ? "Detective is thinking..." : "Ask about flights..."}
                    disabled={isThinking}
                />
                <button 
                    onClick={sendMessage} 
                    disabled={isThinking || !input.trim()}
                    style={{ opacity: (isThinking || !input.trim()) ? 0.5 : 1 }}
                >
                    {isThinking ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;