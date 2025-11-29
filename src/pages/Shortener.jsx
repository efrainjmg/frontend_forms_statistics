import { useState } from 'react'
import axios from 'axios'
import CopyButton from '../components/CopyButton'
import './Shortener.css'

const API_URL = import.meta.env.VITE_API_URL_SHORTENER || 'http://localhost:3000/shorten'

function Shortener() {
    const [url, setUrl] = useState('')
    const [shortUrl, setShortUrl] = useState('')
    const [shortCode, setShortCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const validateUrl = (urlString) => {
        try {
            const urlObj = new URL(urlString)
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
        } catch {
            return false
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setShortUrl('')
        setShortCode('')

        // Validate URL
        if (!url.trim()) {
            setError('Please enter a URL')
            return
        }

        if (!validateUrl(url)) {
            setError('Please enter a valid URL (must start with http:// or https://)')
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(API_URL, {
                url: url.trim()
            })

            // Assuming API returns { shortUrl: "...", code: "..." }
            const { shortUrl: generatedUrl, code } = response.data

            setShortUrl(generatedUrl || `${window.location.origin}/short/${code}`)
            setShortCode(code)
        } catch (err) {
            console.error('Error shortening URL:', err)
            setError(
                err.response?.data?.message ||
                'Failed to shorten URL. Please try again later.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setUrl('')
        setShortUrl('')
        setShortCode('')
        setError('')
    }

    return (
        <div className="container">
            <div className="shortener-page fade-in">
                <div className="hero-section">
                    <h1 className="hero-title">
                        Shorten Your <span className="text-gradient">Links</span>
                    </h1>
                    <p className="hero-subtitle">
                        Create short, memorable links in seconds. Fast, reliable, and free.
                    </p>
                </div>

                <div className="card shortener-card">
                    {!shortUrl ? (
                        <form onSubmit={handleSubmit} className="shortener-form">
                            <div className="form-group">
                                <label htmlFor="url-input" className="form-label">
                                    Enter your long URL
                                </label>
                                <input
                                    id="url-input"
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com/very/long/url/here"
                                    className="url-input"
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="error-message">
                                    <span className="error-icon">⚠️</span>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-large"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Shortening...
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        Shorten URL
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="result-section">
                            <div className="success-icon">✅</div>
                            <h2 className="result-title">Your short link is ready!</h2>

                            <div className="result-box">
                                <div className="short-url-display">
                                    <a
                                        href={shortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="short-url-link"
                                    >
                                        {shortUrl}
                                    </a>
                                </div>
                                <CopyButton text={shortUrl} />
                            </div>

                            <div className="original-url">
                                <span className="text-muted">Original:</span> {url}
                            </div>

                            <button
                                onClick={handleReset}
                                className="btn btn-secondary btn-large mt-md"
                            >
                                Shorten Another URL
                            </button>
                        </div>
                    )}
                </div>

                <div className="features-grid">
                    <div className="feature-card card">
                        <div className="feature-icon">⚡</div>
                        <h3>Lightning Fast</h3>
                        <p className="text-muted">
                            Generate shortened links in milliseconds
                        </p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Analytics</h3>
                        <p className="text-muted">
                            Monitor clicks and engagement metrics
                        </p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure & Reliable</h3>
                        <p className="text-muted">
                            Built on AWS with enterprise-grade security
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shortener
