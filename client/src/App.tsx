import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3000/api/health')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <div>
      <h1>SkillBridge</h1>
      <p>A skill-sharing marketplace</p>
      {message && <p>Server status: {message}</p>}
    </div>
  )
}

export default App
