import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Shortener from './pages/Shortener'
import Statistics from './pages/Statistics'
import RedirectWaiting from './pages/RedirectWaiting'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Shortener />} />
                    <Route path="stats" element={<Statistics />} />
                </Route>
                <Route path="/short/:code" element={<RedirectWaiting />} />
            </Routes>
        </Router>
    )
}

export default App
