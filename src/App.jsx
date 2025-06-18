"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/HomePage"
import Dashboard from "./components/Dashboard"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage setUser={setUser} />} />
        <Route
          path="/dashboard/*"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  )
}

export default App

