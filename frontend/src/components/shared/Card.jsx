export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md
        border border-gray-200
        overflow-hidden
        ${className}
      `}
      style={{
        backgroundColor: 'var(--a11y-bg)',
        borderColor: 'var(--a11y-border)'
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 ${className}`}
      style={{ borderColor: 'var(--a11y-border)' }}
    >
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}
      style={{
        borderColor: 'var(--a11y-border)',
        backgroundColor: 'var(--a11y-bg-secondary)'
      }}
    >
      {children}
    </div>
  )
}
