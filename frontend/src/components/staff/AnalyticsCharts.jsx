import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

import {
  getWeeklyTrends,
  getProgramBreakdown,
  getVolunteerCoverage,
} from '../../mocks/analytics.mock'
import { CHART_COLORS, ANALYTICS_COLORS } from '../../constants'

// Custom chart colors with gradients
const CHART_PALETTE = {
  primary: '#6271f1',      // navy-500
  secondary: '#56965a',    // sage-500
  tertiary: '#d4a106',     // gold-500
  quaternary: '#8b5cf6',   // purple-500
  grid: '#e5e7eb',
  axis: '#9ca3af',
  background: '#ffffff',
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 shadow-lg"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(30, 27, 75, 0.08)',
          boxShadow: '0 10px 30px -10px rgba(30, 27, 75, 0.15)'
        }}
      >
        <p className="text-sm font-semibold text-navy-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span>{' '}
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Custom legend component
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsCharts() {
  const weeklyTrends = getWeeklyTrends()
  const programBreakdown = getProgramBreakdown()
  const volunteerCoverage = getVolunteerCoverage()

  // Updated program breakdown with new colors
  const updatedProgramBreakdown = programBreakdown.map((item, index) => ({
    ...item,
    color: [CHART_PALETTE.primary, CHART_PALETTE.secondary, CHART_PALETTE.tertiary, CHART_PALETTE.quaternary][index % 4]
  }))

  return (
    <div className="space-y-8">
      {/* Registration Trends - Area Chart */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
          border: '1px solid rgba(30, 27, 75, 0.05)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-navy-900">
              Registration Trends
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">Weekly activity across all programs</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_PALETTE.primary }} />
              <span className="text-gray-600">Registrations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_PALETTE.secondary }} />
              <span className="text-gray-600">Volunteers</span>
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrends}>
              <defs>
                <linearGradient id="gradientRegistrations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_PALETTE.primary} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={CHART_PALETTE.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradientVolunteers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_PALETTE.secondary} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={CHART_PALETTE.secondary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_PALETTE.grid}
                vertical={false}
              />
              <XAxis
                dataKey="week"
                stroke={CHART_PALETTE.axis}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={CHART_PALETTE.axis}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="registrations"
                stroke={CHART_PALETTE.primary}
                strokeWidth={2.5}
                fill="url(#gradientRegistrations)"
                name="Registrations"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="volunteers"
                stroke={CHART_PALETTE.secondary}
                strokeWidth={2.5}
                fill="url(#gradientVolunteers)"
                name="Volunteers"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Distribution - Donut Chart */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
            border: '1px solid rgba(30, 27, 75, 0.05)'
          }}
        >
          <h3 className="text-lg font-bold text-navy-900 mb-1">
            Program Distribution
          </h3>
          <p className="text-sm text-gray-500 mb-4">Activities by program type</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={updatedProgramBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {updatedProgramBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {updatedProgramBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}</span>
                <span className="text-sm font-semibold text-navy-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Coverage - Stacked Bar Chart */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
            border: '1px solid rgba(30, 27, 75, 0.05)'
          }}
        >
          <h3 className="text-lg font-bold text-navy-900 mb-1">
            Volunteer Coverage
          </h3>
          <p className="text-sm text-gray-500 mb-4">Daily staffing levels</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volunteerCoverage} barCategoryGap="20%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_PALETTE.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke={CHART_PALETTE.axis}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={CHART_PALETTE.axis}
                  fontSize={12}
                  unit="%"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="covered"
                  stackId="a"
                  fill={CHART_PALETTE.secondary}
                  name="Covered"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="uncovered"
                  stackId="a"
                  fill="#e5e7eb"
                  name="Uncovered"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CHART_PALETTE.secondary }}
              />
              <span className="text-sm text-gray-600">Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: '#e5e7eb' }}
              />
              <span className="text-sm text-gray-600">Uncovered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
