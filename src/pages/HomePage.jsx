import { useNavigate } from 'react-router-dom'
import '../styles/HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()

  const handleStartChat = () => {
    navigate('/chat')
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            AI <span className="accent">Avatar</span> Experience
          </h1>
          <p className="hero-subtitle">
            Immersive conversations with dynamic AI personas. 
            Experience lifelike interactions with emotional depth and realistic animations.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Multiple Personas</h3>
              <p>Interact with different AI characters, each with unique personalities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">😊</div>
              <h3>Emotional Intelligence</h3>
              <p>AI that understands and responds with appropriate emotions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Dynamic Animations</h3>
              <p>Lifelike movements and expressions that bring characters to life</p>
            </div>
          </div>
          <button className="start-button" onClick={handleStartChat}>
            Start Conversation
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage