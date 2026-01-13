import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TicketForm from './TicketForm';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

const TicketMap = () => {
    const [tickets, setTickets] = useState([]);
    const [center] = useState([45.4642, 9.1900]); // Milano
    const [newTicketPos, setNewTicketPos] = useState(null);

    const boundary = [
        [45.0, 9.0],
        [46.0, 10.0]
    ];

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setNewTicketPos(e.latlng);
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

    useEffect(() => {
        loadTickets();
    }, []);

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>

            <MapContainer
                center={center}
                zoom={9}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Rectangle
                    bounds={boundary}
                    pathOptions={{ color: 'blue', weight: 2, fillOpacity: 0.1 }}
                />

                <MapEvents />

                {tickets.map((ticket) => (
                    <Marker
                        key={ticket.id}
                        position={[ticket.location.coordinates[1], ticket.location.coordinates[0]]}
                    >
                        <Popup>
                            <div style={{ minWidth: '200px', maxWidth: '250px' }}>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{ticket.title}</h3>

                                {/* Visualizzazione della categoria nel popup */}
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color: '#2980b9',
                                    textTransform: 'uppercase',
                                    marginBottom: '8px'
                                }}>
                                    📁 {ticket.category || 'Generale'}
                                </div>

                                {ticket.imageNames && ticket.imageNames.length > 0 && (
                                    <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginBottom: '10px', paddingBottom: '5px' }}>
                                        {ticket.imageNames.map((name, index) => (
                                            <img
                                                key={index}
                                                src={`http://127.0.0.1:8082/uploads/${name}`}
                                                alt={`Dettaglio ${index}`}
                                                style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#555' }}>
                                    {ticket.description}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '3px 8px',
                                        borderRadius: '12px',
                                        background: ticket.status === 'OPEN' ? '#ffeaa7' : '#fab1a0',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        {ticket.status}
                                    </span>
                                    <small style={{ color: '#999' }}>ID: {ticket.id.substring(0, 5)}...</small>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {newTicketPos && (
                    <Marker position={newTicketPos}>
                        <Popup>Nuova segnalazione qui</Popup>
                    </Marker>
                )}
            </MapContainer>

            {newTicketPos && (
                <TicketForm
                    latlng={newTicketPos}
                    onSuccess={() => {
                        setNewTicketPos(null);
                        loadTickets();
                    }}
                    onCancel={() => setNewTicketPos(null)}
                />
            )}
        </div>
    );
};

export default TicketMap;