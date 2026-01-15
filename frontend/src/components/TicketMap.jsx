import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TicketForm from './TicketForm';

//normalizza la città in minuscolo
const CURRENT_MUNICIPALITY = "romano di lombardia";

const getPreciseIcon = (category, isNew = false) => {
    let color = isNew ? '#8e44ad' : '#3498db';
    if (!isNew) {
        switch (category) {
            case 'STRADE': color = '#e74c3c'; break;
            case 'ILLUMINAZIONE': color = '#f1c40f'; break;
            case 'RIFIUTI': color = '#e67e22'; break;
            case 'VERDE': color = '#27ae60'; break;
            default: color = '#3498db';
        }
    }
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="25" height="41">
            <path fill="${color}" stroke="#fff" stroke-width="1" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/>
            <circle fill="#000" fill-opacity="0.2" cx="12" cy="12" r="4"/>
        </svg>`;
    return L.divIcon({ className: "custom-precise-pin", html: svgIcon, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
};

const TicketMap = () => {
    const [tickets, setTickets] = useState([]);
    const [center] = useState([45.4642, 9.1900]);
    const [newTicketPos, setNewTicketPos] = useState(null);
    const [address, setAddress] = useState('');
    const [detectedMuni, setDetectedMuni] = useState('');

    const boundary = [[45.0, 9.0], [46.0, 10.0]];

    const MapEvents = () => {
        useMapEvents({
            async click(e) {
                const { lat, lng } = e.latlng;
                setNewTicketPos(e.latlng);
                setAddress("Recupero indirizzo...");
                setDetectedMuni("...");
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, { headers: { 'User-Agent': 'Civitas-Project-App' } });
                    const data = await response.json();
                    const muni = data.address.city || data.address.town || data.address.village || data.address.municipality || "N/A";
                    setDetectedMuni(muni);
                    setAddress(data.display_name || "Indirizzo non trovato");
                } catch (error) {
                    setAddress("Errore dati");
                    setDetectedMuni("Errore");
                }
            },
        });
        return null;
    };

    const loadTickets = async () => {
        try {
            const url = CURRENT_MUNICIPALITY
                ? `http://127.0.0.1:8082/api/tickets?municipalityId=${CURRENT_MUNICIPALITY.toLowerCase()}`
                : `http://127.0.0.1:8082/api/tickets`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Errore caricamento:", error);
        }
    };

    useEffect(() => { loadTickets(); }, []);

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Rectangle bounds={boundary} pathOptions={{ color: 'blue', weight: 1, fillOpacity: 0.05, dashArray: '5,5' }} />
                <MapEvents />

                {tickets.map((ticket) => (
                    <Marker key={ticket.id} position={[ticket.location.coordinates[1], ticket.location.coordinates[0]]} icon={getPreciseIcon(ticket.category)}>
                        <Popup>
                            <div style={{ minWidth: '220px', maxWidth: '280px' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{ticket.title}</h3>
                                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                    <span style={badgeStyle('#2980b9')}>📁 {ticket.category}</span>
                                    <span style={badgeStyle('#34495e')}>🏛️ {ticket.municipalityId}</span>
                                </div>
                                {ticket.address && <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '10px' }}>📍 {ticket.address}</div>}
                                {ticket.imageNames && ticket.imageNames.length > 0 && (
                                    <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginBottom: '10px' }}>
                                        {ticket.imageNames.map((name, index) => (
                                            <img key={index} src={`http://127.0.0.1:8082/uploads/${name}`} style={thumbStyle} alt="media" />
                                        ))}
                                    </div>
                                )}
                                <p style={{ fontSize: '13px' }}>{ticket.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {newTicketPos && <Marker position={newTicketPos} icon={getPreciseIcon(null, true)} />}
            </MapContainer>

            {newTicketPos && (
                <TicketForm
                    latlng={newTicketPos}
                    address={address}
                    municipalityId={detectedMuni}
                    onSuccess={() => { setNewTicketPos(null); loadTickets(); }}
                    onCancel={() => setNewTicketPos(null)}
                />
            )}
        </div>
    );
};

const badgeStyle = (color) => ({ backgroundColor: color, color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' });
const thumbStyle = { width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 };

export default TicketMap;