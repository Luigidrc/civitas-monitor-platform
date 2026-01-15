import './App.css'
import MyTickets from './components/MyTickets'
import NotificationCenter from './components/NotificationCenter';
import Settings from "./components/Settings.jsx";

function App() {
    return (
        <>
            <nav style={{ padding: '1rem', borderBottom: '1px solid #444', marginBottom: '2rem' }}>
                <h1>Civitas Monitor 🏙️</h1>
            </nav>

            <Settings />

            <NotificationCenter />

            <MyTickets />
        </>
    )
}

export default App