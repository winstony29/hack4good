import { describe, it, expect } from 'vitest'
import {
  getWeeklyTrends,
  getProgramBreakdown,
  getVolunteerCoverage,
  getDashboardMetrics,
  weeklyTrendsData,
  programBreakdownData,
  volunteerCoverageData,
  dashboardMetrics,
} from './analytics.mock'

describe('Analytics Mock Data', () => {
  describe('getWeeklyTrends', () => {
    it('returns an array of weekly trend data', () => {
      const data = getWeeklyTrends()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })

    it('each entry has required fields', () => {
      const data = getWeeklyTrends()
      data.forEach(entry => {
        expect(entry).toHaveProperty('week')
        expect(entry).toHaveProperty('registrations')
        expect(entry).toHaveProperty('volunteers')
        expect(typeof entry.week).toBe('string')
        expect(typeof entry.registrations).toBe('number')
        expect(typeof entry.volunteers).toBe('number')
      })
    })

    it('returns same data as weeklyTrendsData export', () => {
      expect(getWeeklyTrends()).toEqual(weeklyTrendsData)
    })
  })

  describe('getProgramBreakdown', () => {
    it('returns an array of program data', () => {
      const data = getProgramBreakdown()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBe(4) // 4 program types
    })

    it('each entry has name, value, and color', () => {
      const data = getProgramBreakdown()
      data.forEach(entry => {
        expect(entry).toHaveProperty('name')
        expect(entry).toHaveProperty('value')
        expect(entry).toHaveProperty('color')
        expect(typeof entry.name).toBe('string')
        expect(typeof entry.value).toBe('number')
        expect(entry.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })

    it('values sum to 100 (percentage distribution)', () => {
      const data = getProgramBreakdown()
      const total = data.reduce((sum, entry) => sum + entry.value, 0)
      expect(total).toBe(100)
    })

    it('returns same data as programBreakdownData export', () => {
      expect(getProgramBreakdown()).toEqual(programBreakdownData)
    })
  })

  describe('getVolunteerCoverage', () => {
    it('returns an array of 7 days', () => {
      const data = getVolunteerCoverage()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBe(7) // 7 days of week
    })

    it('each entry has day, covered, and uncovered', () => {
      const data = getVolunteerCoverage()
      data.forEach(entry => {
        expect(entry).toHaveProperty('day')
        expect(entry).toHaveProperty('covered')
        expect(entry).toHaveProperty('uncovered')
        expect(typeof entry.day).toBe('string')
        expect(typeof entry.covered).toBe('number')
        expect(typeof entry.uncovered).toBe('number')
      })
    })

    it('covered + uncovered equals 100 for each day', () => {
      const data = getVolunteerCoverage()
      data.forEach(entry => {
        expect(entry.covered + entry.uncovered).toBe(100)
      })
    })

    it('returns same data as volunteerCoverageData export', () => {
      expect(getVolunteerCoverage()).toEqual(volunteerCoverageData)
    })
  })

  describe('getDashboardMetrics', () => {
    it('returns an object with all required metrics', () => {
      const metrics = getDashboardMetrics()
      expect(metrics).toHaveProperty('totalActivities')
      expect(metrics).toHaveProperty('totalRegistrations')
      expect(metrics).toHaveProperty('volunteerCoverage')
      expect(metrics).toHaveProperty('upcomingActivities')
      expect(metrics).toHaveProperty('activeVolunteers')
    })

    it('all metrics are numbers', () => {
      const metrics = getDashboardMetrics()
      Object.values(metrics).forEach(value => {
        expect(typeof value).toBe('number')
      })
    })

    it('all metrics are non-negative', () => {
      const metrics = getDashboardMetrics()
      Object.values(metrics).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0)
      })
    })

    it('volunteerCoverage is a percentage (0-100)', () => {
      const metrics = getDashboardMetrics()
      expect(metrics.volunteerCoverage).toBeGreaterThanOrEqual(0)
      expect(metrics.volunteerCoverage).toBeLessThanOrEqual(100)
    })

    it('returns same data as dashboardMetrics export', () => {
      expect(getDashboardMetrics()).toEqual(dashboardMetrics)
    })
  })
})
