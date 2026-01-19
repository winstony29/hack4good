import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card, { CardHeader, CardBody, CardFooter } from './Card'

describe('Card Component', () => {
  describe('Card', () => {
    it('renders children content', () => {
      render(<Card>Test Content</Card>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies default styling classes', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200')
    })

    it('accepts additional className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('custom-class')
    })

    it('applies CSS variables for accessibility theming', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild
      // Check style attribute contains CSS variables (jsdom doesn't compute them)
      expect(card.style.backgroundColor).toBe('var(--a11y-bg)')
      expect(card.style.borderColor).toBe('var(--a11y-border)')
    })

    it('passes through additional props', () => {
      render(<Card data-testid="test-card" aria-label="Test">Content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveAttribute('aria-label', 'Test')
    })
  })

  describe('CardHeader', () => {
    it('renders children content', () => {
      render(<CardHeader>Header Content</CardHeader>)
      expect(screen.getByText('Header Content')).toBeInTheDocument()
    })

    it('applies default styling classes', () => {
      const { container } = render(<CardHeader>Header</CardHeader>)
      const header = container.firstChild
      expect(header).toHaveClass('px-6', 'py-4', 'border-b', 'border-gray-200')
    })

    it('applies CSS variable for border color', () => {
      const { container } = render(<CardHeader>Header</CardHeader>)
      const header = container.firstChild
      // Check style attribute contains CSS variable (jsdom doesn't compute them)
      expect(header.style.borderColor).toBe('var(--a11y-border)')
    })

    it('accepts additional className', () => {
      const { container } = render(<CardHeader className="custom-header">Header</CardHeader>)
      const header = container.firstChild
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardBody', () => {
    it('renders children content', () => {
      render(<CardBody>Body Content</CardBody>)
      expect(screen.getByText('Body Content')).toBeInTheDocument()
    })

    it('applies default styling classes', () => {
      const { container } = render(<CardBody>Body</CardBody>)
      const body = container.firstChild
      expect(body).toHaveClass('px-6', 'py-4')
    })

    it('accepts additional className', () => {
      const { container } = render(<CardBody className="custom-body">Body</CardBody>)
      const body = container.firstChild
      expect(body).toHaveClass('custom-body')
    })
  })

  describe('CardFooter', () => {
    it('renders children content', () => {
      render(<CardFooter>Footer Content</CardFooter>)
      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })

    it('applies default styling classes', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild
      expect(footer).toHaveClass('px-6', 'py-4', 'border-t', 'border-gray-200', 'bg-gray-50')
    })

    it('applies CSS variables for accessibility theming', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild
      // Check style attribute contains CSS variables (jsdom doesn't compute them)
      expect(footer.style.borderColor).toBe('var(--a11y-border)')
      expect(footer.style.backgroundColor).toBe('var(--a11y-bg-secondary)')
    })

    it('accepts additional className', () => {
      const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>)
      const footer = container.firstChild
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Card composition', () => {
    it('renders complete card with all sections', () => {
      render(
        <Card>
          <CardHeader>Header</CardHeader>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Body')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })
})
