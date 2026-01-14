import React from 'react';
import './MyTickets.css';

const MyTickets = () => {
    // Dati finti (MOCK) per vedere l'interfaccia subito
    const mockTickets = [
        { id: 1, category: 'Buche Stradali', status: 'OPEN', date: '2026-01-12', description: 'Voragine in Via Roma' },
        { id: 2, category: 'Illuminazione', status: 'IN_PROGRESS', date: '2026-01-10', description: 'Lampione spento al parco' },
        { id: 3, category: 'Rifiuti', status: 'CLOSED', date: '2025-12-28', description: 'Cassonetto in fiamme' },
    ];

    // Funzione per colorare le etichette dello stato
    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'red';
            case 'IN_PROGRESS': return 'orange';
            case 'CLOSED': return 'green';
            default: return 'gray';
        }
    };

    return (
        <div className="ticket-container">
            <h2>🎫 I Miei Ticket</h2>
            <p>Storico delle tue segnalazioni al Comune.</p>

            <div className="ticket-list">
                {mockTickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-card">
                        <div className="ticket-header">
                            <span className="ticket-category">{ticket.category}</span>
                            <span
                                className="ticket-status"
                                style={{ backgroundColor: getStatusColor(ticket.status) }}
                            >
                {ticket.status}
              </span>
                        </div>
                        <p className="ticket-desc">{ticket.description}</p>
                        <small className="ticket-date">Data: {ticket.date}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyTickets;