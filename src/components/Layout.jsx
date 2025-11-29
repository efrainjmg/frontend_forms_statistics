import { Outlet, Link, useLocation } from 'react-router-dom'
import './Layout.css'

function Layout() {
    const location = useLocation()

    return (
        <div className="layout">
            <nav className="navbar">
                <div className="container">
                    <div className="nav-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🔗</span>
                            <span className="logo-text">ShortLink</span>
                        </Link>

                        <div className="nav-links">
                            <Link
                                to="/"
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                            >
                                Shortener
                            </Link>
                            <Link
                                to="/stats"
                                className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}
                            >
                                Statistics
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <div className="container text-center">
                    <p className="text-muted">
                        Built with ❤️ for Distributed Systems Course
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Layout
