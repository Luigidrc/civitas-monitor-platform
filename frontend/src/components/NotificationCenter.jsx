import React, { useState } from 'react';
import './NotificationCenter.css';

const NotificationCenter = () => {
    // Dati finti: Immagina che questi arrivino da RabbitMQ/Backend
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Ticket Risolto', message: 'La buca in Via Roma è stata riparata.', read: false, time: '10 min fa' },
        { id: 2, title: 'Nuovo Stato', message: 'Il ticket "Lampione" è ora "In Lavorazione".', read: true, time: '1 ora fa' },
        { id: 3, title: 'Benvenuto', message: 'Benvenuto su Civitas Monitor!', read: true, time: '1 giorno fa' },
    ]);

    // Conta quelle non lette
    const unreadCount = notifications.filter(n => !n.read).length;

    // Funzione per segnare tutto come letto
    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
    };

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3>🔔 Notifiche {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h3>
                <button onClick={markAllAsRead} className="mark-read-btn">Segna lette</button>
            </div>

            <div className="notification-list">
                {notifications.map(notif => (
                    <div key={notif.id} className={`notif-card ${notif.read ? 'read' : 'unread'}`}>
                        <div className="notif-title">
                            <strong>{notif.title}</strong>
                            <small>{notif.time}</small>
                        </div>
                        <p>{notif.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationCenter;