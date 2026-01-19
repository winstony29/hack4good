import Navbar from './Navbar'

export default function Layout({ children, showSidebar = false }) {
  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundColor: 'var(--a11y-bg)',
        color: 'var(--a11y-text)'
      }}
    >
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}
