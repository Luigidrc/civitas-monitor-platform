import TicketMap from './components/TicketMap';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Header semplice per l'app */}
      <header style={{
        padding: '1rem',
        background: '#1a1a1a',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Civitas Monitor - Segnalazioni</h1>
      </header>

      {/* La mappa a tutto schermo o quasi */}
      <main style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
        <TicketMap />
      </main>
    </div>
  );
}

export default App;