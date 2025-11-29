import './StatsCard.css'

function StatsCard({ icon, title, value, color = 'primary' }) {
    return (
        <div className={`stats-card card card-${color}`}>
            <div className="stats-card-icon">{icon}</div>
            <div className="stats-card-content">
                <h4 className="stats-card-title text-muted">{title}</h4>
                <div className="stats-card-value">{value}</div>
            </div>
        </div>
    )
}

export default StatsCard
