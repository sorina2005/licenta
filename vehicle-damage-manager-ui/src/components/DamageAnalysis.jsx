import { useState } from 'react';
import api from '../api/axios';

const DamageAnalysis = () => {
    const [text, setText] = useState('');
    const [rezultat, setRezultat] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrimite = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const response = await api.post('/damages/process', { text });
            setRezultat(response.data);
        } catch (error) {
            console.error("Eroare:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-container">
            <h2 className="ai-title">Asistent Inteligenta Artificiala</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                Descrieti daunele pentru o analiza automata imediata.
            </p>

            <textarea
                className="ai-textarea"
                rows="5"
                placeholder="Ex: Am lovit portiera stanga si oglinda in parcarea mall-ului din Cluj..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button
                onClick={handleTrimite}
                disabled={loading}
                className="ai-button"
            >
                {loading ? 'Se analizeaza datele...' : 'Analizeaza Acum'}
            </button>

            {rezultat && (
                <div className="result-card">
                    <h4 style={{ color: '#34a853', marginBottom: '15px' }}>Analiza Finalizata cu Succes</h4>
                    <div className="result-item">
                        <span><strong>Piese Identificate:</strong></span>
                        <span>{rezultat.detectedParts || 'Nicio piesa detectata'}</span>
                    </div>
                    <div className="result-item">
                        <span><strong>Locatie Accident:</strong></span>
                        <span>{rezultat.location || 'Nespecificata'}</span>
                    </div>
                    <div className="result-item">
                        <span><strong>Grad Urgenta:</strong></span>
                        <span style={{
                            color: rezultat.urgency === 'ridicata' ? 'red' : 'orange',
                            fontWeight: 'bold'
                        }}>
                            {rezultat.urgency.toUpperCase()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DamageAnalysis;