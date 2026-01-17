export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-SG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatTime = (time) => {
  if (!time) return ''
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-SG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const formatDateTime = (date, time) => {
  return `${formatDate(date)} at ${formatTime(time)}`
}

export const isUpcoming = (date) => {
  const activityDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return activityDate >= today
}

export const isPast = (date) => {
  return !isUpcoming(date)
}

export const getWeekBoundaries = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
  
  const monday = new Date(d.setDate(diff))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  
  return { start: monday, end: sunday }
}

export const formatRelativeTime = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diffMs = d - now
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`
  if (diffDays < -1 && diffDays > -7) return `${Math.abs(diffDays)} days ago`
  
  return formatDate(date)
}
