import { useState } from 'react'
import axios from 'axios'
import StatsCard from '../components/StatsCard'
import StatsChart from '../components/StatsChart'
import './Statistics.css'

const API_URL = import.meta.env.VITE_API_STATS || 'http://localhost:3000/stats'

function Statistics() {
    const [code, setCode] = useState('')
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setStats(null)

        if (!code.trim()) {
            setError('Please enter a short code')
            return
        }

        setLoading(true)

        try {
            const response = await axios.get(`${API_URL}/${code.trim()}`)

            // Assuming API returns statistics object
            setStats(response.data)
        } catch (err) {
            console.error('Error fetching statistics:', err)
            setError(
                err.response?.status === 404
                    ? 'No statistics found for this code. The link may not exist or hasn\'t been visited yet.'
                    : err.response?.data?.message || 'Failed to fetch statistics. Please try again later.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setCode('')
        setStats(null)
        setError('')
    }

    return (
        <div className="container">
            <div className="statistics-page fade-in">
                <div className="stats-header">
                    <h1 className="page-title">
                        Link <span className="text-gradient">Analytics</span>
                    </h1>
                    <p className="page-subtitle">
                        Track clicks and performance of your shortened links
                    </p>
                </div>

                <div className="card stats-search-card">
                    <form onSubmit={handleSubmit} className="stats-search-form">
                        <div className="form-group">
                            <label htmlFor="code-input" className="form-label">
                                Enter Short Code
                            </label>
                            <input
                                id="code-input"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g., abc123"
                                className="code-input"
                                disabled={loading}
                            />
                            <p className="input-hint text-muted">
                                Enter the code from your shortened URL (the part after /short/)
                            </p>
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <span>📊</span>
                                        View Statistics
                                    </>
                                )}
                            </button>

                            {stats && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="btn btn-secondary"
                                >
                                    Search Another
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {stats && (
                    <div className="stats-results fade-in">
                        <div className="stats-info-header">
                            <h2>Statistics for: <code>{code}</code></h2>
                            {stats.originalUrl && (
                                <p className="original-url-display">
                                    <span className="text-muted">Original URL:</span>{' '}
                                    <a
                                        href={stats.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="url-link"
                                    >
                                        {stats.originalUrl}
                                    </a>
                                </p>
                            )}
                        </div>

                        <div className="stats-grid">
                            <StatsCard
                                icon="👆"
                                title="Total Clicks"
                                value={stats.clicks || stats.totalClicks || stats.count || 0}
                                color="primary"
                            />

                            <StatsCard
                                icon="📅"
                                title="Created"
                                value={stats.createdAt ? new Date(stats.createdAt).toLocaleDateString() : 'N/A'}
                                color="accent"
                            />

                            <StatsCard
                                icon="🕐"
                                title="Last Accessed"
                                value={stats.lastAccessed ? new Date(stats.lastAccessed).toLocaleDateString() : 'Never'}
                                color="success"
                            />

                            {stats.uniqueVisitors !== undefined && (
                                <StatsCard
                                    icon="👥"
                                    title="Unique Visitors"
                                    value={stats.uniqueVisitors}
                                    color="warning"
                                />
                            )}
                        </div>

                        {stats.clickHistory && stats.clickHistory.length > 0 && (
                            <div className="chart-section card">
                                <h3>Click History</h3>
                                <StatsChart data={stats.clickHistory} />
                            </div>
                        )}

                        {(!stats.clicks && !stats.totalClicks && !stats.count) && (
                            <div className="no-data-message card text-center">
                                <div className="no-data-icon">📭</div>
                                <h3>No Clicks Yet</h3>
                                <p className="text-muted">
                                    This link hasn't been clicked yet. Share it to start tracking analytics!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Statistics
