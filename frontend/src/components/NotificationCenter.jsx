import React, { useState, useEffect } from 'react';
import './NotificationCenter.css';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);

    // Questa funzione scatta appena il componente viene caricato
    useEffect(() => {
        fetchNotifications();

        // (Opzionale) Aggiorna ogni 5 secondi
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            // ⚠️ Nota: Per ora puntiamo diretti alla porta 8084 (Port Forward)
            // In produzione passeremo dal Gateway (8080)
            const response = await fetch('http://localhost:8084/api/notifications?user=Luigi');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Errore nel caricamento notifiche:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        // Qui in futuro faremo una chiamata PUT al server
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
                {notifications.length === 0 ? (
                    <p style={{color: '#888', fontStyle: 'italic'}}>Nessuna notifica.</p>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className={`notif-card ${notif.read ? 'read' : 'unread'}`}>
                            <div className="notif-title">
                                <strong>{notif.title}</strong>
                                <small>{new Date(notif.createdAt).toLocaleTimeString()}</small>
                            </div>
                            <p>{notif.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;