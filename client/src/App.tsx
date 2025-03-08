import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/layout/Navbar'
import MentorProfile from './pages/MentorProfile'
import ReviewTest from './components/reviews/ReviewTest'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3000/api/health')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Navigation Links */}
        <div className="py-4 px-6 bg-white shadow-sm">
          <nav className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/reviews" className="text-gray-600 hover:text-gray-900">Review Test</Link>
          </nav>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<MentorProfile />} />
          <Route path="/reviews" element={<ReviewTest />} />
        </Routes>

        {message && (
          <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
            <p className="text-sm text-gray-500">Server status: {message}</p>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
