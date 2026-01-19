import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StaffDashboard from './StaffDashboard'

// Mock the AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test Staff', role: 'staff' }
  })
}))

// Mock AnalyticsCharts to simplify testing
vi.mock('../staff/AnalyticsCharts', () => ({
  default: () => <div data-testid="analytics-charts">Analytics Charts Mock</div>
}))

// Mock the analytics mock data
vi.mock('../../mocks/analytics.mock', () => ({
  getDashboardMetrics: () => ({
    totalActivities: 24,
    totalRegistrations: 196,
    volunteerCoverage: 82,
    upcomingActivities: 8,
    activeVolunteers: 56,
  })
}))

describe('StaffDashboard', () => {
  it('renders without crashing', () => {
    render(<StaffDashboard />)
  })

  it('displays the dashboard title', () => {
    render(<StaffDashboard />)
    expect(screen.getByText('Staff Dashboard')).toBeInTheDocument()
  })

  it('displays the dashboard subtitle', () => {
    render(<StaffDashboard />)
    expect(screen.getByText('Overview of all activities and analytics')).toBeInTheDocument()
  })

  describe('Stats Cards', () => {
    it('displays Total Activities card with value', () => {
      render(<StaffDashboard />)
      expect(screen.getByText('Total Activities')).toBeInTheDocument()
      expect(screen.getByText('24')).toBeInTheDocument()
    })

    it('displays Total Registrations card with value', () => {
      render(<StaffDashboard />)
      expect(screen.getByText('Total Registrations')).toBeInTheDocument()
      expect(screen.getByText('196')).toBeInTheDocument()
    })

    it('displays Active Volunteers card with value', () => {
      render(<StaffDashboard />)
      expect(screen.getByText('Active Volunteers')).toBeInTheDocument()
      expect(screen.getByText('56')).toBeInTheDocument()
    })

    it('displays Volunteer Coverage card with percentage', () => {
      render(<StaffDashboard />)
      expect(screen.getByText('Volunteer Coverage')).toBeInTheDocument()
      expect(screen.getByText('82%')).toBeInTheDocument()
    })

    it('renders 4 stats cards', () => {
      const { container } = render(<StaffDashboard />)
      // Stats cards are in a grid with 4 items
      const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4')
      expect(grid).toBeInTheDocument()
      expect(grid.children.length).toBe(4)
    })
  })

  describe('Analytics Section', () => {
    it('displays Analytics & Trends section header', () => {
      render(<StaffDashboard />)
      expect(screen.getByText('Analytics & Trends')).toBeInTheDocument()
    })

    it('renders AnalyticsCharts component', () => {
      render(<StaffDashboard />)
      expect(screen.getByTestId('analytics-charts')).toBeInTheDocument()
    })
  })

  describe('Activity Management Section', () => {
    it('displays Manage Activities section header', () => {
      render(<StaffDashboard />)
      expect(screen.getByText('Manage Activities')).toBeInTheDocument()
    })
  })
})
