import { useState } from 'react';

const TicketForm = ({ latlng, onSuccess, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepariamo il payload in formato GeoJSON per MongoDB
        const newTicket = {
            title,
            description,
            location: {
                type: "Point",
                coordinates: [latlng.lng, latlng.lat] // [longitudine, latitudine]
            }
        };

        try {
            const response = await fetch('http://127.0.0.1:8082/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTicket)
            });

            if (response.ok) {
                alert("Segnalazione inviata con successo!");
                onSuccess();
            } else {
                const errorText = await response.text();
                // Nel caso di errore del geofencing
                alert("Errore: " + errorText);
            }
        } catch (error) {
            alert("Errore di connessione al server");
        }
    };

    return (
        <div style={formContainerStyle}>
            <h3>Nuova Segnalazione</h3>
            <p><small>Posizione: {latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}</small></p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" placeholder="Titolo (es. Buca in strada)"
                    value={title} onChange={(e) => setTitle(e.target.value)} required
                />
                <textarea
                    placeholder="Descrizione dettagliata..."
                    value={description} onChange={(e) => setDescription(e.target.value)} required
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white' }}>Invia</button>
                    <button type="button" onClick={onCancel} style={{ backgroundColor: '#c0392b', color: 'white' }}>Annulla</button>
                </div>
            </form>
        </div>
    );
};

// Semplice stile CSS-in-JS per il popup del form
const formContainerStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    width: '300px'
};

export default TicketForm;