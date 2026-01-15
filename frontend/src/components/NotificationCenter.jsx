import React, { useState, useEffect } from 'react';
import './NotificationCenter.css';

// 1. Definiamo l'utente FUORI dal componente.
// Essendo fuori, non viene mai ricreato, quindi React non si confonde mai.
const CURRENT_USER = "Luigi";

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);

    // Funzione ausiliaria semplice per scaricare i dati (usata dal bottone)
    const refreshData = async () => {
        try {
            const response = await fetch(`http://localhost:8084/api/notifications?user=${CURRENT_USER}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Errore fetch:", error);
        }
    };

    // 2. useEffect totalmente isolato
    useEffect(() => {
        // Definiamo la logica qui dentro per evitare dipendenze esterne
        const loadInitial = async () => {
            await refreshData();
        };

        loadInitial();

        // Polling ogni 5 secondi
        const interval = setInterval(() => {
            refreshData();
        }, 5000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Array vuoto = Esegui solo all'avvio (e attiva il timer)

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = async () => {
        console.log("📨 Segna tutto come letto...");

        // Aggiornamento Ottimistico
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);

        try {
            const response = await fetch(`http://localhost:8084/api/notifications/read-all?user=${CURRENT_USER}`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                console.error("❌ Errore Backend:", response.status);
                refreshData(); // Se fallisce, ricarica i dati veri
            } else {
                console.log("✅ Backend aggiornato!");
            }
        } catch (error) {
            console.error("❌ Errore di rete:", error);
            refreshData();
        }
    };

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3>🔔 Notifiche {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h3>
                <button
                    onClick={markAllAsRead}
                    className="mark-read-btn"
                    disabled={unreadCount === 0}
                >
                    Segna lette
                </button>
            </div>

            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p style={{color: '#888', fontStyle: 'italic', padding: '10px'}}>Nessuna notifica.</p>
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