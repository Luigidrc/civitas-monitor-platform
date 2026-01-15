import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
    const userId = "Luigi"; // Simuliamo l'utente loggato
    const [prefs, setPrefs] = useState({ emailEnabled: true, pushEnabled: true });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Carica impostazioni all'avvio
    useEffect(() => {
        fetch(`http://localhost:8084/api/preferences?userId=${userId}`)
            .then(res => res.json())
            .then(data => setPrefs(data))
            .catch(err => console.error(err));
    }, []);

    // Salva quando clicchi gli switch
    const handleToggle = async (type) => {
        setLoading(true);
        const newPrefs = { ...prefs, [type]: !prefs[type] };

        // Aggiornamento ottimistico (cambia subito visivamente)
        setPrefs(newPrefs);

        try {
            const res = await fetch(`http://localhost:8084/api/preferences?userId=${userId}&email=${newPrefs.emailEnabled}&push=${newPrefs.pushEnabled}`, {
                method: 'PUT'
            });
            if (res.ok) setMessage('✅ Salvato!');
        } catch (error) {
            setMessage('❌ Errore salvataggio');
            // Rollback in caso di errore
            setPrefs(prefs);
        }
        setLoading(false);
        setTimeout(() => setMessage(''), 2000);
    };

    return (
        <div className="settings-panel">
            <h3>⚙️ Impostazioni Notifiche</h3>

            <div className="setting-row">
                <span>📧 Notifiche Email</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={prefs.emailEnabled}
                        onChange={() => handleToggle('emailEnabled')}
                        disabled={loading}
                    />
                    <span className="slider round"></span>
                </label>
            </div>

            <div className="setting-row">
                <span>🔔 Notifiche Push</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={prefs.pushEnabled}
                        onChange={() => handleToggle('pushEnabled')}
                        disabled={loading}
                    />
                    <span className="slider round"></span>
                </label>
            </div>

            {message && <small className="status-msg">{message}</small>}
        </div>
    );
};

export default Settings;