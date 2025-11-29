import { useState } from 'react'
import './CopyButton.css'

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            // Modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text)
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea')
                textArea.value = text
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
            }

            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <button
            onClick={handleCopy}
            className={`copy-button ${copied ? 'copied' : ''}`}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
            {copied ? (
                <>
                    <span className="copy-icon">✓</span>
                    Copied!
                </>
            ) : (
                <>
                    <span className="copy-icon">📋</span>
                    Copy
                </>
            )}
        </button>
    )
}

export default CopyButton
