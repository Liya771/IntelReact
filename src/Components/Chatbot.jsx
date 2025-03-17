import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css"; // Import CSS

const Chatbot = () => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResponse(""); // Clear previous response

        try {
            const res = await axios.post("http://localhost:5000/chat", { message: query });
            setResponse(res.data.reply);
        } catch (error) {
            setResponse("❌ Error fetching response. Try again.");
            console.error("Chatbot Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <h2>🤖 AI Chatbot</h2>
            <div className="chat-box">
                <input 
                    type="text" 
                    placeholder="Ask me anything..." 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Thinking..." : "Send"}
                </button>
                <div className="response-box">
                    {loading ? "🤖 Generating response..." : response}
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
