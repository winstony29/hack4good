import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AnalyticsCharts from './AnalyticsCharts'

// Mock Recharts to avoid canvas/SVG rendering issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
}))

describe('AnalyticsCharts', () => {
  it('renders without crashing', () => {
    render(<AnalyticsCharts />)
  })

  it('renders Registration Trends section', () => {
    render(<AnalyticsCharts />)
    expect(screen.getByText('Registration Trends')).toBeInTheDocument()
  })

  it('renders Program Distribution section', () => {
    render(<AnalyticsCharts />)
    expect(screen.getByText('Program Distribution')).toBeInTheDocument()
  })

  it('renders Volunteer Coverage section', () => {
    render(<AnalyticsCharts />)
    expect(screen.getByText('Volunteer Coverage by Day')).toBeInTheDocument()
  })

  it('renders all three chart types', () => {
    render(<AnalyticsCharts />)
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders responsive containers for all charts', () => {
    render(<AnalyticsCharts />)
    const containers = screen.getAllByTestId('responsive-container')
    expect(containers.length).toBe(3) // One for each chart
  })

  it('renders program type legend items', () => {
    render(<AnalyticsCharts />)
    expect(screen.getByText('Arts & Crafts')).toBeInTheDocument()
    expect(screen.getByText('Exercise')).toBeInTheDocument()
    expect(screen.getByText('Social Activities')).toBeInTheDocument()
    expect(screen.getByText('Music Therapy')).toBeInTheDocument()
  })

  it('has proper section styling', () => {
    const { container } = render(<AnalyticsCharts />)
    const sections = container.querySelectorAll('.bg-white.border.border-gray-200.rounded-lg')
    expect(sections.length).toBeGreaterThanOrEqual(3)
  })

  it('has proper grid layout for side-by-side charts', () => {
    const { container } = render(<AnalyticsCharts />)
    const grid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2')
    expect(grid).toBeInTheDocument()
  })
})
