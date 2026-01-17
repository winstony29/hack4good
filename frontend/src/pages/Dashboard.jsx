import { useAuth } from '../contexts/AuthContext'
import { ROLES } from '../utils/constants'
import Layout from '../components/layout/Layout'
import DashboardContainer from '../components/dashboard/DashboardContainer'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <Layout>
      <DashboardContainer />
    </Layout>
  )
}
