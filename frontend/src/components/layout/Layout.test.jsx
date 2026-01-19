import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from './Layout'

// Mock the Navbar component
vi.mock('./Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar Mock</nav>
}))

// Wrapper for router context
const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  )
}

describe('Layout Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Layout>Content</Layout>)
  })

  it('renders children content', () => {
    renderWithRouter(<Layout>Test Content</Layout>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders the Navbar component', () => {
    renderWithRouter(<Layout>Content</Layout>)
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('applies min-h-screen class for full height', () => {
    const { container } = renderWithRouter(<Layout>Content</Layout>)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('min-h-screen')
  })

  it('applies CSS variables for accessibility theming', () => {
    const { container } = renderWithRouter(<Layout>Content</Layout>)
    const wrapper = container.firstChild
    expect(wrapper).toHaveStyle({
      backgroundColor: 'var(--a11y-bg)',
      color: 'var(--a11y-text)'
    })
  })

  it('wraps content in a main element with container styling', () => {
    renderWithRouter(<Layout>Main Content</Layout>)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('container', 'mx-auto', 'px-4', 'py-8', 'max-w-7xl')
  })

  it('accepts showSidebar prop without error', () => {
    // showSidebar is accepted but not currently used
    renderWithRouter(<Layout showSidebar={true}>Content</Layout>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders complex children correctly', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </Layout>
    )
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })
})
