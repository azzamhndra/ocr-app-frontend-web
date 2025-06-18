import { useState } from "react"
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }
      
      // Handle successful login
      setSuccess(true)

        // Store user data in localStorage and state
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        
        // Redirect to dashboard
        // navigate('/dashboard')
        window.location.href = "/dashboard";
      
    } catch (err) {
      setError(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src="/logo.jpg" alt="Logo" className="login-logo-icon" style={{ width: '100px', height: '100px' }} />
          </div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Enter your credentials to access your account</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Login successful! Redirecting...</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-container">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg> */}
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-container">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg> */}
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" className="checkbox" />
              <label htmlFor="remember">Remember me</label>
            </div>
            {/* <a href="#" className="forgot-password">Forgot password?</a> */}
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        
        {/* <div className="social-login">
          <p className="social-text">Or continue with</p>
          <div className="social-buttons">
            <button className="social-button google">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
            </button>
            <button className="social-button facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.9,2H3.1C2.5,2,2,2.5,2,3.1v17.8C2,21.5,2.5,22,3.1,22h9.6v-7.7h-2.6v-3h2.6V9.2c0-2.6,1.6-4,3.9-4c1.1,0,2.1,0.1,2.3,0.1v2.7h-1.6c-1.3,0-1.5,0.6-1.5,1.5v1.9h3l-0.4,3h-2.6V22h5.1c0.6,0,1.1-0.5,1.1-1.1V3.1C22,2.5,21.5,2,20.9,2z"/>
              </svg>
            </button>
            <button className="social-button apple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5,3C14.76,3,13.09,4.03,12,5.15C10.91,4.03,9.24,3,7.5,3C4.42,3,2,5.41,2,8.5c0,3.77,3.4,6.86,8.55,11.53L12,21.35l1.45-1.32C18.6,15.36,22,12.27,22,8.5C22,5.41,19.58,3,16.5,3z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="signup-link">
          <p>Don't have an account? <Link to="#">Sign up</Link></p>
        </div> */}
      </div>
    </div>
  )
}

export default LoginPage
