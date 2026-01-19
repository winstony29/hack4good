import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { activitiesApi } from '../../services/activities.api'
import ActivityForm from '../activities/ActivityForm'
import ActivityCard from '../activities/ActivityCard'
import Button from '../shared/Button'
import Modal from '../shared/Modal'
import EmptyState from '../shared/EmptyState'
import { Plus, Calendar, Search, Filter, LayoutGrid, List } from 'lucide-react'

export default function ActivityManager() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await activitiesApi.getAll()
      setActivities(response.data.activities || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      toast.error('Failed to load activities. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data) => {
    try {
      await activitiesApi.create(data)
      await fetchActivities()
      setShowForm(false)
      toast.success('Activity created successfully')
    } catch (error) {
      console.error('Failed to create activity:', error)
      toast.error('Create failed. Please try again.')
    }
  }

  const handleUpdate = async (data) => {
    try {
      await activitiesApi.update(editingActivity.id, data)
      await fetchActivities()
      setEditingActivity(null)
      toast.success('Activity updated successfully')
    } catch (error) {
      console.error('Failed to update activity:', error)
      toast.error('Update failed. Please try again.')
    }
  }

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 4px 30px -10px rgba(30, 27, 75, 0.08), 0 0 0 1px rgba(30, 27, 75, 0.03)'
      }}
    >
      {/* Header */}
      <div className="px-6 sm:px-8 py-6 border-b border-navy-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
              Manage Activities
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Create, edit, and manage your volunteer activities
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white
                       transition-shadow duration-200 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #6271f1 0%, #4a4de5 100%)',
              boxShadow: '0 4px 15px -3px rgba(98, 113, 241, 0.4)'
            }}
          >
            <Plus className="w-4 h-4" />
            Create Activity
          </motion.button>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                         bg-gray-50 border border-gray-200
                         focus:bg-white focus:border-navy-300 focus:ring-2 focus:ring-navy-100
                         transition-all duration-200 outline-none"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-navy-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-navy-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 text-gray-500">
              <div className="w-5 h-5 border-2 border-navy-200 border-t-navy-500 rounded-full animate-spin" />
              <span>Loading activities...</span>
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-12">
            {searchQuery ? (
              <EmptyState
                icon={Search}
                title="No results found"
                description={`No activities match "${searchQuery}"`}
                action={
                  <Button variant="secondary" onClick={() => setSearchQuery('')}>
                    Clear search
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={Calendar}
                title="No activities yet"
                description="Create your first activity to get started"
                action={
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #6271f1 0%, #4a4de5 100%)'
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Create Activity
                  </motion.button>
                }
              />
            )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'space-y-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="cursor-pointer rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-lg"
                    style={{
                      background: '#ffffff',
                      boxShadow: '0 2px 10px -3px rgba(30, 27, 75, 0.06), 0 0 0 1px rgba(30, 27, 75, 0.03)'
                    }}
                    onClick={() => setEditingActivity(activity)}
                  >
                    <ActivityCard
                      activity={activity}
                      onClick={() => setEditingActivity(activity)}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Activity count footer */}
      {!loading && filteredActivities.length > 0 && (
        <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-navy-700">{filteredActivities.length}</span>
            {searchQuery && ` of ${activities.length}`} activities
          </p>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Create Activity"
        size="large"
      >
        <ActivityForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        title="Edit Activity"
        size="large"
      >
        {editingActivity && (
          <ActivityForm
            activity={editingActivity}
            onSubmit={handleUpdate}
            onCancel={() => setEditingActivity(null)}
          />
        )}
      </Modal>
    </div>
  )
}
