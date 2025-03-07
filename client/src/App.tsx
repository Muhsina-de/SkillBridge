import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/layout/Navbar'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3000/api/health')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SkillBridge
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with mentors, share skills, and grow together
          </p>
          <div className="flex justify-center space-x-4">
            <button className="btn btn-primary">Find a Mentor</button>
            <button className="btn bg-white border border-gray-300 hover:bg-gray-50">
              Become a Mentor
            </button>
          </div>
          {message && (
            <p className="mt-8 text-sm text-gray-500">
              Server status: {message}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
