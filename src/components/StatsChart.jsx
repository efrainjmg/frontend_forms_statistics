import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './StatsChart.css'

function StatsChart({ data }) {
    // Transform data if needed - expecting array of { date/timestamp, clicks/count }
    const chartData = data.map((item, index) => ({
        name: item.date || item.timestamp || `Day ${index + 1}`,
        clicks: item.clicks || item.count || item.value || 0
    }))

    return (
        <div className="stats-chart-container">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(250, 85%, 60%)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(250, 85%, 60%)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 12%, 25%)" />
                    <XAxis
                        dataKey="name"
                        stroke="hsl(0, 0%, 70%)"
                        style={{ fontSize: '0.875rem' }}
                    />
                    <YAxis
                        stroke="hsl(0, 0%, 70%)"
                        style={{ fontSize: '0.875rem' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(240, 15%, 12%)',
                            border: '1px solid hsl(255, 100%, 80%, 0.2)',
                            borderRadius: '0.5rem',
                            color: 'hsl(0, 0%, 95%)'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke="hsl(250, 85%, 60%)"
                        strokeWidth={3}
                        fill="url(#colorClicks)"
                        dot={{ fill: 'hsl(250, 85%, 60%)', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default StatsChart
