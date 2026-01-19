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
} from 'recharts'

import {
  getWeeklyTrends,
  getProgramBreakdown,
  getVolunteerCoverage,
} from '../../mocks/analytics.mock'
import { CHART_COLORS } from '../../constants'

export default function AnalyticsCharts() {
  const weeklyTrends = getWeeklyTrends()
  const programBreakdown = getProgramBreakdown()
  const volunteerCoverage = getVolunteerCoverage()

  return (
    <div className="space-y-8">
      {/* Registration Trends - Line Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Registration Trends
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="week"
                stroke={CHART_COLORS.axis}
                fontSize={12}
              />
              <YAxis stroke={CHART_COLORS.axis} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: `1px solid ${CHART_COLORS.grid}`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke={CHART_COLORS.registrations}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.registrations, strokeWidth: 2 }}
                name="Registrations"
              />
              <Line
                type="monotone"
                dataKey="volunteers"
                stroke={CHART_COLORS.volunteers}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.volunteers, strokeWidth: 2 }}
                name="Volunteers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Distribution - Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Program Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {programBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: `1px solid ${CHART_COLORS.grid}`,
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value} activities`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {programBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Coverage - Stacked Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Volunteer Coverage by Day
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volunteerCoverage}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                <XAxis dataKey="day" stroke={CHART_COLORS.axis} fontSize={12} />
                <YAxis stroke={CHART_COLORS.axis} fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: `1px solid ${CHART_COLORS.grid}`,
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend />
                <Bar
                  dataKey="covered"
                  stackId="a"
                  fill={CHART_COLORS.covered}
                  name="Covered"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="uncovered"
                  stackId="a"
                  fill={CHART_COLORS.uncovered}
                  name="Uncovered"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
