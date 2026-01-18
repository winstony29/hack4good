import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Card, { CardHeader, CardBody } from '../components/shared/Card'
import ActivityCalendar from '../components/activities/ActivityCalendar'
import ActivityDetailModal from '../components/activities/ActivityDetailModal'
import Input from '../components/shared/Input'
import Button from '../components/shared/Button'
import { useAuth } from '../contexts/AuthContext'
import { registrationsApi } from '../services/registrations.api'

export default function Activities() {
  const { user } = useAuth()
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState('all')
  const [userRegistrations, setUserRegistrations] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserRegistrations()
    }
  }, [user])

  const fetchUserRegistrations = async () => {
    try {
      const response = await registrationsApi.getAll()
      setUserRegistrations(response.data || [])
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
    }
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const handleRegister = async (activity) => {
    // Registration is handled in the modal
    // Refresh registrations after successful registration
    await fetchUserRegistrations()
  }

  const getFilterOptions = () => {
    const options = {}
    
    if (searchQuery) {
      options.search = searchQuery
    }
    
    if (programFilter !== 'all') {
      options.program_type = programFilter
    }

    return options
  }

  const userRole = user?.user_metadata?.role

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Browse Activities
                </h1>
                <p className="text-gray-600 mt-2">
                  Discover and register for upcoming activities
                </p>
              </div>
              
              {/* Filter Toggle Button (Mobile) */}
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardHeader>

          <CardBody>
            {/* Search and Filters */}
            <div className={`mb-6 space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Program Type Filter */}
                <div className="md:w-64">
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Programs</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts & Crafts</option>
                    <option value="music">Music</option>
                    <option value="social">Social</option>
                    <option value="educational">Educational</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || programFilter !== 'all') && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {programFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Program: {programFilter}
                      <button
                        onClick={() => setProgramFilter('all')}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setProgramFilter('all')
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Activity Calendar */}
            <ActivityCalendar
              mode="view"
              onActivityClick={handleActivityClick}
              filterOptions={getFilterOptions()}
            />
          </CardBody>
        </Card>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedActivity(null)
          }}
          action={userRole === 'participant' ? 'register' : 'view'}
          onConfirm={handleRegister}
          userRegistrations={userRegistrations}
        />
      )}
    </Layout>
  )
}
