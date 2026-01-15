import React, { useState, useEffect } from 'react';

const ManagerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [showCloseForm, setShowCloseForm] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null); // Per la Timeline
  const [report, setReport] = useState({ description: '', photoUrl: '' });
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/tickets');
      const data = await response.json();
      setTickets(data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Errore nel caricamento dei ticket:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const stats = {
    received: tickets.filter(t => t.status === 'RECEIVED').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    total: tickets.length
  };

  const handleReject = async (id) => {
    await fetch(`http://localhost:8082/api/tickets/${id}/reject`, { method: 'PATCH' });
    fetchTickets();
  };

  const handleTakeCharge = async (id) => {
    await fetch(`http://localhost:8082/api/tickets/${id}/take-charge?operatorId=VITTORIO_AIR3`, { method: 'PATCH' });
    fetchTickets();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReport({ ...report, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseTicket = async (id) => {
    const response = await fetch(`http://localhost:8082/api/tickets/${id}/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    if (response.ok) {
      setShowCloseForm(null);
      setReport({ description: '', photoUrl: '' });
      fetchTickets();
    }
  };

  const styles = {
    container: { padding: '40px', fontFamily: '"Segoe UI", sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #dee2e6' },
    titleGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
    refreshBtn: { backgroundColor: 'white', color: '#1a73e8', border: '1px solid #dadce0', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', transition: 'all 0.2s ease' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' },
    th: { backgroundColor: '#1f1f1f', color: 'white', padding: '15px', textAlign: 'center', fontSize: '12px', fontWeight: '600' },
    td: { padding: '16px', borderBottom: '1px solid #f1f3f4', fontSize: '14px', textAlign: 'center', color: '#3c4043' },
    tdDescription: { padding: '16px', borderBottom: '1px solid #f1f3f4', fontSize: '14px', color: '#3c4043', textAlign: 'left', width: '40%' },
    badge: (status) => ({
      padding: '5px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold',
      backgroundColor: status === 'REJECTED' ? '#fce8e6' : status === 'RESOLVED' ? '#e6f4ea' : '#e8f0fe',
      color: status === 'REJECTED' ? '#d93025' : status === 'RESOLVED' ? '#137333' : '#1967d2'
    }),
    btn: { padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', borderLeft: '8px solid #1e8e3e' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dadce0', marginBottom: '15px', fontSize: '14px', boxSizing: 'border-box' },
    fileBtn: { display: 'block', padding: '12px', backgroundColor: '#f8f9fa', color: '#3c4043', border: '2px dashed #dadce0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'center', marginBottom: '15px' },
    previewContainer: { position: 'relative', marginBottom: '15px' },
    previewImg: { width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' },
    removeImg: { position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#d93025', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px' },
    
    // Timeline Styles
    timelineContainer: { marginTop: '20px', paddingLeft: '20px', borderLeft: '2px solid #dadce0', marginLeft: '10px' },
    timelineItem: { marginBottom: '15px', position: 'relative', textAlign: 'left' },
    timelineDot: { position: 'absolute', left: '-27px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1a73e8', border: '2px solid white' },
    timelineTime: { fontSize: '11px', color: '#70757a', display: 'block' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={{ margin: 0, color: '#202124', fontSize: '24px' }}>🏙️ Civitas Monitor</h1>
          <button onClick={fetchTickets} style={styles.refreshBtn} title="Aggiorna">↻</button>
        </div>
        <div style={{fontSize: '12px', color: '#70757a'}}>Ultimo controllo: {lastUpdate}</div>
      </div>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.card, borderTop: '4px solid #4285f4' }}>
          <span style={{fontSize: '11px', color: '#5f6368', fontWeight: 'bold'}}>DA LAVORARE</span>
          <span style={{fontSize: '24px', fontWeight: 'bold', display: 'block', color: '#4285f4'}}>{stats.received}</span>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #fbbc04' }}>
          <span style={{fontSize: '11px', color: '#5f6368', fontWeight: 'bold'}}>IN CORSO</span>
          <span style={{fontSize: '24px', fontWeight: 'bold', display: 'block', color: '#fbbc04'}}>{stats.inProgress}</span>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #34a853' }}>
          <span style={{fontSize: '11px', color: '#5f6368', fontWeight: 'bold'}}>RISOLTI</span>
          <span style={{fontSize: '24px', fontWeight: 'bold', display: 'block', color: '#34a853'}}>{stats.resolved}</span>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #70757a' }}>
          <span style={{fontSize: '11px', color: '#5f6368', fontWeight: 'bold'}}>TOTALE</span>
          <span style={{fontSize: '24px', fontWeight: 'bold', display: 'block'}}>{stats.total}</span>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID TICKET</th>
            <th style={{ ...styles.th, textAlign: 'left' }}>DESCRIZIONE</th>
            <th style={styles.th}>STATO</th>
            <th style={styles.th}>GESTIONE</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td style={styles.td}><code>{t.id.slice(-6).toUpperCase()}</code></td>
              <td style={styles.tdDescription}>{t.description}</td>
              <td style={styles.td}>
                <span style={styles.badge(t.status)}>{t.status}</span>
              </td>
              <td style={styles.td}>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <button style={{ ...styles.btn, backgroundColor: '#f1f3f4', color: '#3c4043' }} onClick={() => setSelectedTicket(t)}>👁️ Info</button>
                  {t.status === 'RECEIVED' && (
                    <>
                      <button style={{ ...styles.btn, backgroundColor: '#1a73e8', color: 'white' }} onClick={() => handleTakeCharge(t.id)}>Lavora</button>
                      <button style={{ ...styles.btn, backgroundColor: '#d93025', color: 'white' }} onClick={() => handleReject(t.id)}>Rifiuta</button>
                    </>
                  )}
                  {t.status === 'IN_PROGRESS' && (
                    <button style={{ ...styles.btn, backgroundColor: '#1e8e3e', color: 'white' }} onClick={() => setShowCloseForm(t.id)}>Chiudi</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODALE TIMELINE */}
      {selectedTicket && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, borderLeft: '8px solid #1a73e8' }}>
            <h3 style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between' }}>
              📜 Cronologia Ticket #{selectedTicket.id.slice(-6).toUpperCase()}
              <span style={{ cursor: 'pointer' }} onClick={() => setSelectedTicket(null)}>×</span>
            </h3>
            <div style={styles.timelineContainer}>
              {selectedTicket.history && selectedTicket.history.length > 0 ? (
                selectedTicket.history.map((event, index) => (
                  <div key={index} style={styles.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <span style={styles.timelineTime}>{new Date(event.timestamp).toLocaleString()}</span>
                    <strong>{event.status}</strong>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}> Dettagli: {event.details || "CAMPO VUOTO NEL DB"}</p>
                  </div>
                ))
              ) : <p>Nessuno storico disponibile.</p>}
            </div>
          </div>
        </div>
      )}

      {/* MODALE CHIUSURA */}
      {showCloseForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ marginTop: 0, color: '#137333' }}>✅ Rapporto Intervento</h3>
            <textarea 
              placeholder="Cosa è stato fatto?" 
              value={report.description} 
              onChange={(e) => setReport({ ...report, description: e.target.value })}
              style={{ ...styles.input, minHeight: '100px', resize: 'none' }}
            />
            <label style={styles.fileBtn}>
              {report.photoUrl ? '📸 Foto caricata' : '📁 Seleziona foto dal dispositivo'}
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
            {report.photoUrl && (
              <div style={styles.previewContainer}>
                <img src={report.photoUrl} alt="Preview" style={styles.previewImg} />
                <button style={styles.removeImg} onClick={() => setReport({...report, photoUrl: ''})}>✕</button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ ...styles.btn, backgroundColor: '#1e8e3e', color: 'white', flex: 1 }} onClick={() => handleCloseTicket(showCloseForm)}>Salva e Risolvi</button>
              <button style={{ ...styles.btn, backgroundColor: '#f1f3f4', color: '#3c4043', flex: 1 }} onClick={() => setShowCloseForm(null)}>Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;