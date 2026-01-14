import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TicketForm from './TicketForm';

// --- FUNZIONE PER CREARE IL SEGNALINO CLASSICO MA COLORATO ---
const getPreciseIcon = (category) => {
    let color = '#3498db'; // Blu (Default)

    switch (category) {
        case 'STRADE': color = '#e74c3c'; break;        // Rosso
        case 'ILLUMINAZIONE': color = '#f1c40f'; break; // Giallo
        case 'RIFIUTI': color = '#e67e22'; break;       // Arancione
        case 'VERDE': color = '#27ae60'; break;         // Verde
        default: color = '#3498db';
    }

    // Usiamo un SVG che replica esattamente la forma del marker originale di Leaflet
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="25" height="41">
            <path fill="${color}" stroke="#fff" stroke-width="1" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/>
            <circle fill="#000" fill-opacity="0.2" cx="12" cy="12" r="4"/>
        </svg>
    `;

    return L.divIcon({
        className: "custom-precise-pin",
        html: svgIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41], // Punta precisa
        popupAnchor: [1, -34]
    });
};

// Icona viola per il marker del click (nuova segnalazione)
const newMarkerIcon = L.divIcon({
    className: "new-precise-pin",
    html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="25" height="41">
            <path fill="#8e44ad" stroke="#fff" stroke-width="1" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/>
        </svg>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const TicketMap = () => {
    const [tickets, setTickets] = useState([]);
    const [center] = useState([45.4642, 9.1900]);
    const [newTicketPos, setNewTicketPos] = useState(null);
    const [address, setAddress] = useState('');

    const boundary = [[45.0, 9.0], [46.0, 10.0]];

    const MapEvents = () => {
        useMapEvents({
            async click(e) {
                const { lat, lng } = e.latlng;
                setNewTicketPos(e.latlng);
                setAddress("Recupero indirizzo...");
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
                        { headers: { 'User-Agent': 'Civitas-Project-App' } }
                    );
                    const data = await response.json();
                    setAddress(data.display_name || "Indirizzo non trovato");
                } catch (error) {
                    setAddress("Errore nel recupero indirizzo");
                }
            },
        });
        return null;
    };

    const loadTickets = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8082/api/tickets');
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Errore nel caricamento dei ticket:", error);
        }
    };

    useEffect(() => { loadTickets(); }, []);

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Rectangle bounds={boundary} pathOptions={{ color: 'blue', weight: 2, fillOpacity: 0.1 }} />
                <MapEvents />

                {tickets.map((ticket) => (
                    <Marker
                        key={ticket.id}
                        position={[ticket.location.coordinates[1], ticket.location.coordinates[0]]}
                        icon={getPreciseIcon(ticket.category)} // ICONA CLASSICA COLORATA
                    >
                        <Popup>
                            <div style={{ minWidth: '200px', maxWidth: '280px' }}>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{ticket.title}</h3>
                                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2980b9', textTransform: 'uppercase', marginBottom: '5px' }}>
                                    📁 {ticket.category}
                                </div>
                                {ticket.address && (
                                    <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '8px', lineHeight: '1.3' }}>
                                        📍 {ticket.address}
                                    </div>
                                )}
                                {ticket.imageNames && ticket.imageNames.length > 0 && (
                                    <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginBottom: '10px', paddingBottom: '5px' }}>
                                        {ticket.imageNames.map((name, index) => (
                                            <img key={index} src={`http://127.0.0.1:8082/uploads/${name}`} style={{ width: '90px', height: '65px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} alt="media" />
                                        ))}
                                    </div>
                                )}
                                <p style={{ fontSize: '13px', color: '#333' }}>{ticket.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {newTicketPos && <Marker position={newTicketPos} icon={newMarkerIcon} />}
            </MapContainer>

            {newTicketPos && (
                <TicketForm
                    latlng={newTicketPos}
                    address={address}
                    onSuccess={() => { setNewTicketPos(null); loadTickets(); }}
                    onCancel={() => setNewTicketPos(null)}
                />
            )}
        </div>
    );
};

export default TicketMap;