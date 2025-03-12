import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import LandingPage from './pages/LandingPage'
import MentorsPage from './pages/MentorsPage'
import MentorProfile from './pages/MentorProfile'
import Reviews from './components/reviews/ReviewTest'
import SignIn from './components/signIn/signIn'
import SignUp from './components/signUp/signUp'
import TrendingRepos from './components/TrendingRepos/TrendingReposPage'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/mentor/:id" element={<MentorProfile />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/trending" element={<TrendingRepos />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App