import React, { useState } from 'react';

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [currentDraft, setCurrentDraft] = useState(null);
    const [inputText, setInputText] = useState("");

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        const response = await fetch("http://localhost:8080/api/damages/analyze-draft", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        const data = await response.json();

        setMessages([...messages, { sender: "user", text }, { sender: "bot", text: data.response }]);
        setInputText("");

        if (data.intent === "report_damage" && data.piese_detectate.length > 0) {
            setCurrentDraft(data);
        }
    };

    const handleFinalConfirm = async () => {
        const response = await fetch("http://localhost:8080/api/damages/confirm-save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentDraft)
        });
        const result = await response.json();

        setMessages([...messages, { sender: "bot", text: result.message }]);
        setCurrentDraft(null);
    };

    return (
        <div className="chat-container">
            <div className="messages-list">
                {messages.map((m, i) => <div key={i} className={m.sender}>{m.text}</div>)}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
                />
                <button onClick={() => sendMessage(inputText)}>Trimite</button>
            </div>

            {currentDraft && (
                <div className="confirmation-card">
                    <h3>Confirmare Date Dauna</h3>
                    <p>Piese detectate: {currentDraft.piese_detectate.join(", ")}</p>
                    <p>Locatie: {currentDraft.locatii[0] || "Nespecificata"}</p>
                    <button onClick={handleFinalConfirm}>Da, salveaza dosarul</button>
                    <button onClick={() => setCurrentDraft(null)}>Nu, corecteaza</button>
                </div>
            )}
        </div>
    );
};

export default ChatComponent;