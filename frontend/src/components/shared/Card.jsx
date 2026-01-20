export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white
        shadow-lg
        border-2 border-gray-200
        overflow-hidden
        ${hover ? 'transition-all duration-200 hover:shadow-xl hover:-translate-y-1' : ''}
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
      className={`px-6 py-5 border-b-2 border-gray-200 ${className}`}
      style={{ borderColor: 'var(--a11y-border)' }}
    >
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`px-6 py-4 border-t-2 border-gray-200 bg-gray-50 ${className}`}
      style={{
        borderColor: 'var(--a11y-border)',
        backgroundColor: 'var(--a11y-bg-secondary)'
      }}
    >
      {children}
    </div>
  )
}
