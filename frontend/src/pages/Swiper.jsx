import Layout from '../components/layout/Layout'
import ActivitySwiper from '../components/volunteer/ActivitySwiper'

export default function Swiper() {
  const handleMatch = (activity) => {
    console.log('Matched with:', activity.title)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center">
          Find Activities
        </h1>
        <ActivitySwiper onMatch={handleMatch} />
      </div>
    </Layout>
  )
}
