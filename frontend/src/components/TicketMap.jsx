import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TicketForm from './TicketForm';

// --- FIX ICONE DEFAULT LEAFLET ---
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
// ---------------------------------

const TicketMap = () => {
    const [tickets, setTickets] = useState([]);
    const [center] = useState([45.4642, 9.1900]); // Milano
    const [newTicketPos, setNewTicketPos] = useState(null);

    // Definiamo i confini del Geofencing (gli stessi del backend Java)
    // Formato: [[lat_min, lng_min], [lat_max, lng_max]]
    const boundary = [
        [45.0, 9.0],
        [46.0, 10.0]
    ];

    // Componente interno per gestire i click
    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setNewTicketPos(e.latlng);
            },
        });
        return null;
    };

    // Funzione per caricare i ticket dal backend (Porta 8082 + IP 127.0.0.1)
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
                zoom={9} // Zoom leggermente più lontano per vedere il rettangolo
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* VISUALIZZAZIONE GEOFENCING: Rettangolo blu semitrasparente */}
                <Rectangle
                    bounds={boundary}
                    pathOptions={{ color: 'blue', weight: 2, fillOpacity: 0.1 }}
                />

                <MapEvents />

                {/* Ticket esistenti */}
                {tickets.map((ticket) => (
                    <Marker
                        key={ticket.id}
                        position={[ticket.location.coordinates[1], ticket.location.coordinates[0]]}
                    >
                        <Popup>
                            <div style={{ minWidth: '150px' }}>
                                <h3 style={{ margin: '0 0 5px 0' }}>{ticket.title}</h3>
                                <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>{ticket.description}</p>
                                <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: '#e0e0e0',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {ticket.status}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Marker temporaneo click */}
                {newTicketPos && (
                    <Marker position={newTicketPos}>
                        <Popup>Nuova segnalazione...</Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Form overlay */}
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