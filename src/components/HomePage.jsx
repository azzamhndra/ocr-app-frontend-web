import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Welcome to Our App</h1>
        <p className="text-lg text-muted mt-2">Please login to continue</p>
      </div>
      <div className="flex justify-center">
        <Link 
          to="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    </main>
  )
}

export default HomePage
