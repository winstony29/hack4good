export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white rounded-2xl
        shadow-soft
        border border-minds-border
        overflow-hidden
        ${hover ? 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1' : ''}
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
      className={`px-6 py-5 border-b border-minds-border ${className}`}
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
      className={`px-6 py-4 border-t border-minds-border bg-minds-cream/50 ${className}`}
      style={{
        borderColor: 'var(--a11y-border)',
        backgroundColor: 'var(--a11y-bg-secondary)'
      }}
    >
      {children}
    </div>
  )
}
