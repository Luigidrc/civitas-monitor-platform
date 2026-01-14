import { useState } from 'react';

const TicketForm = ({ latlng, address, onSuccess, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('STRADE');
    const [files, setFiles] = useState([]); // Array per le foto

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        const ticketData = {
            title,
            description,
            category,
            address,
            location: {
                type: "Point",
                coordinates: [latlng.lng, latlng.lat]
            }
        };

        formData.append('ticket', new Blob([JSON.stringify(ticketData)], {
            type: 'application/json'
        }));

        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('http://127.0.0.1:8082/api/tickets', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert("Segnalazione inviata con successo!");
                onSuccess();
            } else {
                const errorText = await response.text();
                alert("Errore: " + errorText);
            }
        } catch (error) {
            alert("Errore di connessione al server");
        }
    };

    return (
        <div style={formContainerStyle}>
            <h3 style={{ marginTop: 0, color: '#2c3e50', marginBottom: '5px' }}>Nuova Segnalazione</h3>

            <div style={addressBoxStyle}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#7f8c8d' }}>📍 POSIZIONE RILEVATA</span>
                <p style={{ fontSize: '12px', margin: '2px 0', color: '#34495e', lineHeight: '1.2' }}>
                    {address || "Recupero posizione..."}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={labelStyle}>CATEGORIA</label>
                    <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="STRADE">Strade e Marciapiedi</option>
                        <option value="ILLUMINAZIONE">Illuminazione Pubblica</option>
                        <option value="RIFIUTI">Gestione Rifiuti</option>
                        <option value="VERDE">Verde Pubblico</option>
                        <option value="ALTRO">Altro</option>
                    </select>
                </div>

                <input
                    type="text" placeholder="Titolo (es. Buca in strada)"
                    style={inputStyle}
                    value={title} onChange={(e) => setTitle(e.target.value)} required
                />

                <textarea
                    placeholder="Descrizione dettagliata..."
                    style={{ ...inputStyle, minHeight: '60px' }}
                    value={description} onChange={(e) => setDescription(e.target.value)} required
                />

                <div style={{ margin: '5px 0' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>
                        Foto (Seleziona uno o più file):
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ fontSize: '12px', width: '100%' }}
                    />

                    {/* INDICATORE FILE SELEZIONATI - RIPRISTINATO */}
                    {files.length > 0 && (
                        <div style={{ marginTop: '8px', padding: '5px', backgroundColor: '#e8f5e9', borderRadius: '4px', border: '1px solid #c8e6c9' }}>
                            <p style={{ fontSize: '11px', color: '#2e7d32', margin: 0, fontWeight: 'bold' }}>
                                {files.length} {files.length === 1 ? 'foto selezionata' : 'foto selezionate'}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <button type="submit" style={submitBtnStyle}>Invia</button>
                    <button type="button" onClick={onCancel} style={cancelBtnStyle}>Annulla</button>
                </div>
            </form>
        </div>
    );
};

// Stili (invariati)
const addressBoxStyle = { backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '6px', border: '1px solid #e9ecef', marginBottom: '15px' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#7f8c8d' };
const formContainerStyle = { position: 'absolute', top: '20px', right: '20px', zIndex: 1000, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', width: '320px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' };
const submitBtnStyle = { flex: 1, padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { flex: 1, padding: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };

export default TicketForm;