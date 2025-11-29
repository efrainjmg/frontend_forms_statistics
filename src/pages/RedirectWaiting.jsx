import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import './RedirectWaiting.css'

const API_URL = import.meta.env.VITE_API_REDIRECT || 'http://localhost:3000/redirect'
const COUNTDOWN_SECONDS = 5

function RedirectWaiting() {
    const { code } = useParams()
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [originalUrl, setOriginalUrl] = useState(null)

    useEffect(() => {
        // Fetch the original URL from the backend
        const fetchOriginalUrl = async () => {
            try {
                const response = await axios.get(`${API_URL}/${code}`)

                // Assuming API returns { url: "..." } or { originalUrl: "..." }
                const url = response.data.url || response.data.originalUrl

                if (!url) {
                    throw new Error('No URL found in response')
                }

                setOriginalUrl(url)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching URL:', err)
                setError(
                    err.response?.status === 404
                        ? 'This short link does not exist or has expired.'
                        : 'Failed to retrieve the URL. Please try again later.'
                )
                setLoading(false)
            }
        }

        fetchOriginalUrl()
    }, [code])

    useEffect(() => {
        // Start countdown only if we have the original URL
        if (!loading && originalUrl && !error) {
            if (countdown > 0) {
                const timer = setTimeout(() => {
                    setCountdown(countdown - 1)
                }, 1000)
                return () => clearTimeout(timer)
            } else {
                // Redirect to the original URL
                window.location.href = originalUrl
            }
        }
    }, [countdown, loading, originalUrl, error])

    // Calculate progress percentage for the circular progress bar
    const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100

    if (loading) {
        return (
            <div className="redirect-page">
                <div className="redirect-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="redirect-page">
                <div className="redirect-container error-container fade-in">
                    <div className="error-icon-large">❌</div>
                    <h1 className="error-title">Link Not Found</h1>
                    <p className="error-description">{error}</p>
                    <div className="error-actions">
                        <Link to="/" className="btn btn-primary">
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="redirect-page">
            <div className="redirect-container fade-in">
                <div className="redirecting-header">
                    <div className="redirect-icon">🔗</div>
                    <h1 className="redirect-title">Redirecting...</h1>
                </div>

                <div className="countdown-circle">
                    <svg className="progress-ring" width="200" height="200">
                        <circle
                            className="progress-ring-bg"
                            cx="100"
                            cy="100"
                            r="90"
                        />
                        <circle
                            className="progress-ring-fill"
                            cx="100"
                            cy="100"
                            r="90"
                            style={{
                                strokeDashoffset: 565.48 - (565.48 * progress) / 100
                            }}
                        />
                    </svg>
                    <div className="countdown-number">{countdown}</div>
                </div>

                <p className="redirect-message">
                    You will be redirected in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}
                </p>

                <div className="destination-info">
                    <p className="text-muted">Destination:</p>
                    <a
                        href={originalUrl}
                        className="destination-url"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {originalUrl}
                    </a>
                </div>

                <button
                    onClick={() => window.location.href = originalUrl}
                    className="btn btn-outline mt-md"
                >
                    Skip & Go Now
                </button>
            </div>
        </div>
    )
}

export default RedirectWaiting
