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
import ForumPage from './pages/ForumPage'
import NewTopicPage from './pages/NewTopicPage'
import TopicDetailPage from './pages/TopicDetailPage'

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
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/topics/:id" element={<TopicDetailPage />} />
            <Route path="/forum/new" element={<NewTopicPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App