import Layout from '../components/layout/Layout'
import Card, { CardHeader, CardBody } from '../components/shared/Card'

export default function Activities() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">
              Browse Activities
            </h1>
            <p className="text-gray-600 mt-2">
              Discover upcoming activities and events
            </p>
          </CardHeader>
          <CardBody>
            {/* TODO: Implement ActivityCalendar component */}
            <div className="py-12 text-center text-gray-500">
              Activity calendar will be displayed here
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}
