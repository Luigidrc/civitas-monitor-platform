import './App.css'
import MyTickets from './components/MyTickets'
import NotificationCenter from './components/NotificationCenter';

function App() {
    return (
        <>
            <nav style={{ padding: '1rem', borderBottom: '1px solid #444', marginBottom: '2rem' }}>
                <h1>Civitas Monitor 🏙️</h1>
            </nav>

            {/* 2. Aggiungi il componente QUI, prima dei ticket */}
            <NotificationCenter />

            <div style={{ margin: '40px 0' }}></div> {/* Un po' di spazio */}

            <MyTickets />
        </>
    )
}

export default App