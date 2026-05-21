import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([{ text: "Buna ziua! Cum va pot ajuta astazi?", sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [currentDraft, setCurrentDraft] = useState(null);
    const scrollRef = useRef();

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const currentInput = input;
        setMessages(prev => [...prev, { text: currentInput, sender: 'user' }]);
        setInput('');

        try {
            // URL Corectat conform Java: /analyze
            const res = await axios.post('http://localhost:8080/api/damages/analyze', { text: currentInput });
            const data = res.data;

            setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);

            // Daca AI detecteaza o dauna, salvam draft-ul pentru confirmare
            if (data.intent === "report_damage" && data.piese_detectate.length > 0) {
                setCurrentDraft(data);
            }
        } catch (err) {
            setMessages(prev => [...prev, { text: "Eroare de conexiune cu serverul.", sender: 'bot' }]);
        }
    };

    const handleConfirm = async () => {
        try {
            // URL Corectat conform Java: /confirm
            const res = await axios.post('http://localhost:8080/api/damages/confirm', currentDraft);
            setMessages(prev => [...prev, { text: res.data.message, sender: 'bot' }]);
            setCurrentDraft(null);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Eroare la salvarea dosarului.", sender: 'bot' }]);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', background: '#1e1e1e', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontFamily: 'Arial' }}>
            <div style={{ height: '450px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                        <div style={{ padding: '12px 16px', borderRadius: '15px', fontSize: '14px', background: m.sender === 'user' ? '#007bff' : '#333', color: 'white' }}>
                            {m.text}
                        </div>
                    </div>
                ))}

                {/* Cardul de Confirmare stilizat */}
                {currentDraft && (
                    <div style={{ background: '#2d2d2d', padding: '15px', borderRadius: '10px', border: '1px solid #007bff', marginTop: '10px', color: 'white' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><b>Validare AI:</b> Am detectat piese avariate.</p>
                        <ul style={{ fontSize: '12px', color: '#ccc' }}>
                            {currentDraft.piese_detectate.map((p, idx) => <li key={idx}>{p}</li>)}
                        </ul>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleConfirm} style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Confirma si Salveaza</button>
                            <button onClick={() => setCurrentDraft(null)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Anuleaza</button>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <div style={{ display: 'flex', padding: '15px', background: '#252525' }}>
                <input style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: '#333', color: 'white', outline: 'none' }}
                       value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Scrieti aici..." />
                <button style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '20px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}
                        onClick={handleSend}>Trimite</button>
            </div>
        </div>
    );
};

export default Chatbot;